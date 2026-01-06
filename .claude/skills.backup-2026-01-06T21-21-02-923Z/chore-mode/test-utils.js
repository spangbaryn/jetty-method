/**
 * Test utilities for chore-mode skill
 * Type-aware test running that adapts based on chore type
 */

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Chore-specific constants (simpler than speed-mode)
const MAX_ITERATIONS = 5;
const TEST_TIMEOUT = 60000; // 60 seconds

/**
 * Build test command based on chore type and affected paths
 *
 * @param {string} type - Chore type: refactor, dependency, cleanup, tooling
 * @param {string[]} affectedPaths - Paths to affected test files/patterns
 * @returns {string} npm test command with appropriate scope
 *
 * @example
 * buildTestCommand('refactor', ['lib/validation.test.js', 'lib/helpers.test.js'])
 * // Returns: 'npm test -- lib/validation.test.js lib/helpers.test.js'
 *
 * buildTestCommand('dependency', [])
 * // Returns: 'npm test'
 */
function buildTestCommand(type, affectedPaths = []) {
  switch (type) {
    case 'refactor':
    case 'cleanup':
      // Run only affected tests
      if (affectedPaths.length > 0) {
        return `npm test -- ${affectedPaths.join(' ')}`;
      }
      // Fall through to full suite if no paths specified
      return 'npm test';

    case 'dependency':
      // Always run full suite for dependency updates
      return 'npm test';

    case 'tooling':
      // Tooling may not have unit tests - return null to indicate manual verification
      if (affectedPaths.length > 0) {
        return `npm test -- ${affectedPaths.join(' ')}`;
      }
      return null; // Indicates manual/CI verification needed

    default:
      return 'npm test';
  }
}

/**
 * Run tests with timeout based on chore type
 *
 * @param {string} type - Chore type
 * @param {string[]} affectedPaths - Paths to affected test files
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, timedOut: boolean, skipped: boolean}>}
 */
async function runAffectedTests(type, affectedPaths = [], timeout = TEST_TIMEOUT) {
  const command = buildTestCommand(type, affectedPaths);

  // Tooling chores may not have unit tests
  if (command === null) {
    return {
      stdout: 'No unit tests for tooling chore - use CI/manual verification',
      stderr: '',
      exitCode: 0,
      timedOut: false,
      skipped: true
    };
  }

  try {
    const result = await exec(command, {
      timeout,
      killSignal: 'SIGTERM'
    });
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: 0,
      timedOut: false,
      skipped: false
    };
  } catch (error) {
    if (error.killed) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        timedOut: true,
        skipped: false
      };
    }

    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1,
      timedOut: false,
      skipped: false
    };
  }
}

/**
 * Parse Jest/npm test output to extract pass/fail counts
 *
 * @param {string} testOutput - Raw test output
 * @returns {{passed: number, failed: number, total: number, failedTests: string[]}}
 */
function parseTestOutput(testOutput) {
  const result = {
    passed: 0,
    failed: 0,
    total: 0,
    failedTests: []
  };

  // Jest format: "Tests: X passed, Y failed, Z total"
  const jestMatch = testOutput.match(/Tests:\s*(\d+)\s*passed,?\s*(\d+)?\s*failed,?\s*(\d+)\s*total/i);
  if (jestMatch) {
    result.passed = parseInt(jestMatch[1], 10);
    result.failed = parseInt(jestMatch[2] || '0', 10);
    result.total = parseInt(jestMatch[3], 10);
  }

  // Alternative Jest format: "X passing" or "Tests: X passed, Y total"
  if (result.total === 0) {
    const passedMatch = testOutput.match(/(\d+)\s*pass(?:ing|ed)/i);
    const failedMatch = testOutput.match(/(\d+)\s*fail(?:ing|ed)?/i);
    if (passedMatch) result.passed = parseInt(passedMatch[1], 10);
    if (failedMatch) result.failed = parseInt(failedMatch[1], 10);
    result.total = result.passed + result.failed;
  }

  // Extract failed test names (Jest FAIL lines)
  const lines = testOutput.split('\n');
  for (const line of lines) {
    if (line.includes('FAIL') && line.includes('.test.')) {
      const testMatch = line.match(/FAIL\s+(.+\.test\.[jt]sx?)/);
      if (testMatch) {
        result.failedTests.push(testMatch[1]);
      }
    }
    // Also capture individual test failures
    if (line.trim().startsWith('✕') || line.trim().startsWith('×')) {
      result.failedTests.push(line.trim());
    }
  }

  return result;
}

/**
 * Establish test baseline before making chore changes
 *
 * @param {string} type - Chore type
 * @param {string[]} affectedPaths - Paths to affected test files
 * @returns {Promise<{success: boolean, result: object, message: string}>}
 */
async function establishBaseline(type, affectedPaths = []) {
  const testResult = await runAffectedTests(type, affectedPaths);

  if (testResult.skipped) {
    return {
      success: true,
      result: testResult,
      message: 'Tooling chore - no unit test baseline (use CI verification)'
    };
  }

  if (testResult.timedOut) {
    return {
      success: false,
      result: testResult,
      message: 'Test execution timed out while establishing baseline'
    };
  }

  const parsed = parseTestOutput(testResult.stdout + testResult.stderr);

  if (testResult.exitCode !== 0) {
    return {
      success: false,
      result: { ...testResult, parsed },
      message: `Baseline tests failing: ${parsed.failed}/${parsed.total} tests failed. Fix existing failures before proceeding.`
    };
  }

  return {
    success: true,
    result: { ...testResult, parsed },
    message: `Baseline established: ${parsed.passed}/${parsed.total} tests passing`
  };
}

/**
 * Run iteration loop until tests pass or max iterations reached
 *
 * @param {string} type - Chore type
 * @param {string[]} affectedPaths - Paths to affected test files
 * @param {Function} onIteration - Callback called each iteration with (iterationNum, result)
 * @param {number} maxIterations - Maximum iterations (default: MAX_ITERATIONS)
 * @returns {Promise<{success: boolean, iterations: number, finalResult: object}>}
 */
async function iterateUntilPass(type, affectedPaths = [], onIteration = null, maxIterations = MAX_ITERATIONS) {
  let iteration = 0;
  let lastResult = null;

  while (iteration < maxIterations) {
    iteration++;

    const testResult = await runAffectedTests(type, affectedPaths);

    if (testResult.skipped) {
      // Tooling chore - assume success
      return {
        success: true,
        iterations: iteration,
        finalResult: testResult
      };
    }

    const parsed = parseTestOutput(testResult.stdout + testResult.stderr);
    lastResult = { ...testResult, parsed };

    // Call iteration callback if provided
    if (onIteration) {
      onIteration(iteration, lastResult);
    }

    // Check for success
    if (testResult.exitCode === 0) {
      return {
        success: true,
        iterations: iteration,
        finalResult: lastResult
      };
    }

    // Check for timeout
    if (testResult.timedOut) {
      return {
        success: false,
        iterations: iteration,
        finalResult: lastResult,
        reason: 'timeout'
      };
    }
  }

  // Max iterations reached
  return {
    success: false,
    iterations: iteration,
    finalResult: lastResult,
    reason: 'max_iterations'
  };
}

/**
 * Get test scope description based on chore type
 *
 * @param {string} type - Chore type
 * @returns {string} Human-readable description of test scope
 */
function getTestScopeDescription(type) {
  switch (type) {
    case 'refactor':
      return 'Affected module tests only (do NOT modify assertions)';
    case 'dependency':
      return 'Full test suite (catch all regressions)';
    case 'cleanup':
      return 'Affected module tests (verify no broken references)';
    case 'tooling':
      return 'CI/manual verification (focus on verification over unit tests)';
    default:
      return 'Full test suite';
  }
}

module.exports = {
  MAX_ITERATIONS,
  TEST_TIMEOUT,
  buildTestCommand,
  runAffectedTests,
  parseTestOutput,
  establishBaseline,
  iterateUntilPass,
  getTestScopeDescription
};
