/**
 * Test execution utilities for speed mode TDD loop
 * Provides RED-GREEN iteration capabilities with timeout and graceful termination
 */

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Test execution constants
const MAX_ITERATIONS = 10;
const TEST_TIMEOUT = 60000; // 60 seconds

/**
 * Run BDD tests with timeout and graceful process termination
 *
 * @param {string} featureFile - Path to the feature file to test
 * @param {number} timeout - Maximum execution time in milliseconds (default: TEST_TIMEOUT)
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, timedOut: boolean}>}
 *
 * @example
 * const result = await runBddTestWithTimeout('features/my-feature.feature');
 * if (result.timedOut) {
 *   console.log('Test execution timed out');
 * } else if (result.exitCode === 0) {
 *   console.log('Tests passed!');
 * }
 */
async function runBddTestWithTimeout(featureFile, timeout = TEST_TIMEOUT) {
  try {
    const result = await exec(
      `npm run test:bdd -- ${featureFile}`,
      {
        timeout,
        killSignal: 'SIGTERM' // Graceful termination first
      }
    );
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: 0
    };
  } catch (error) {
    // Check if process was killed due to timeout
    if (error.killed) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        timedOut: true
      };
    }

    // Normal test failure
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1
    };
  }
}

/**
 * Run specific BDD scenario with timeout
 *
 * @param {string} featureFile - Path to the feature file
 * @param {number|string} scenarioSelector - Line number or scenario name
 * @param {number} timeout - Maximum execution time in milliseconds (default: TEST_TIMEOUT)
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, timedOut: boolean}>}
 *
 * @example
 * // Run by line number
 * const result = await runBddScenarioWithTimeout('features/login.feature', 15);
 *
 * // Run by scenario name
 * const result = await runBddScenarioWithTimeout('features/login.feature', 'Invalid password');
 */
async function runBddScenarioWithTimeout(featureFile, scenarioSelector, timeout = TEST_TIMEOUT) {
  // Construct target based on selector type
  const target = typeof scenarioSelector === 'number'
    ? `${featureFile}:${scenarioSelector}`
    : `${featureFile} --name "${scenarioSelector}"`;

  try {
    const result = await exec(
      `npm run test:bdd -- ${target}`,
      {
        timeout,
        killSignal: 'SIGTERM'
      }
    );
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: 0
    };
  } catch (error) {
    if (error.killed) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        timedOut: true
      };
    }

    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1
    };
  }
}

/**
 * Parse test output to extract progress information
 *
 * @param {string} testOutput - Raw Cucumber test output
 * @returns {{passed: number, total: number, failedSteps: string[], newlyPassingSteps: string[]}}
 *
 * @example
 * const result = parseTestProgress(cucumberOutput);
 * console.log(`Progress: ${result.passed} of ${result.total} steps passing`);
 * result.newlyPassingSteps.forEach(step => console.log(`✅ Now passing: ${step}`));
 */
function parseTestProgress(testOutput) {
  const lines = testOutput.split('\n');
  const result = {
    passed: 0,
    total: 0,
    failedSteps: [],
    newlyPassingSteps: []
  };

  // Parse Cucumber summary line (e.g., "5 scenarios (3 passed, 2 failed)")
  // and step counts (e.g., "15 steps (10 passed, 5 failed)")
  const stepSummaryMatch = testOutput.match(/(\d+)\s+steps?\s+\(([^)]+)\)/i);
  if (stepSummaryMatch) {
    const [, totalSteps, statusBreakdown] = stepSummaryMatch;
    result.total = parseInt(totalSteps, 10);

    // Extract passed count from breakdown
    const passedMatch = statusBreakdown.match(/(\d+)\s+passed/i);
    if (passedMatch) {
      result.passed = parseInt(passedMatch[1], 10);
    }
  }

  // Extract failed step names (lines starting with "✖" or containing "failed:")
  for (const line of lines) {
    if (line.trim().startsWith('✖') || line.includes('failed:')) {
      const stepMatch = line.match(/(?:✖|failed:)\s*(.+)/i);
      if (stepMatch) {
        result.failedSteps.push(stepMatch[1].trim());
      }
    }
  }

  return result;
}

/**
 * Compare two test results to identify newly passing steps
 *
 * @param {{passed: number, total: number, failedSteps: string[]}} previousResult
 * @param {{passed: number, total: number, failedSteps: string[]}} currentResult
 * @returns {string[]} Array of step names that are now passing
 *
 * @example
 * const before = { passed: 2, total: 5, failedSteps: ['step A', 'step B', 'step C'] };
 * const after = { passed: 3, total: 5, failedSteps: ['step A', 'step C'] };
 * const newlyPassing = findNewlyPassingSteps(before, after);
 * // Returns: ['step B']
 */
function findNewlyPassingSteps(previousResult, currentResult) {
  const previousFailed = new Set(previousResult.failedSteps);
  const currentFailed = new Set(currentResult.failedSteps);

  const newlyPassing = [];
  for (const step of previousFailed) {
    if (!currentFailed.has(step)) {
      newlyPassing.push(step);
    }
  }

  return newlyPassing;
}

/**
 * Extract detailed error information from test output
 *
 * @param {string} testOutput - Raw Cucumber test output
 * @returns {{errors: Array<{step: string, message: string, stack: string}>}}
 *
 * @example
 * const errors = extractErrors(cucumberOutput);
 * errors.errors.forEach(err => {
 *   console.log(`Failed: ${err.step}`);
 *   console.log(`Error: ${err.message}`);
 *   if (err.stack) console.log(`Stack: ${err.stack}`);
 * });
 */
function extractErrors(testOutput) {
  const lines = testOutput.split('\n');
  const errors = [];
  let currentError = null;
  let inStackTrace = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect failed step (starts with ✖ or contains "✖")
    if (line.includes('✖')) {
      // Save previous error if exists
      if (currentError) {
        errors.push(currentError);
      }

      // Start new error
      const stepMatch = line.match(/✖\s*(.+)/);
      currentError = {
        step: stepMatch ? stepMatch[1].trim() : line.trim(),
        message: '',
        stack: ''
      };
      inStackTrace = false;
      continue;
    }

    // Capture error message (typically indented line after failed step)
    if (currentError && !currentError.message && line.trim() && !inStackTrace) {
      // Look for Error: or AssertionError: patterns
      if (line.includes('Error:') || line.includes('AssertionError')) {
        currentError.message = line.trim();
        inStackTrace = true;
        continue;
      }
      // Or just capture the first non-empty line after the failed step
      if (line.trim().length > 0 && !line.includes('Scenario:') && !line.includes('Feature:')) {
        currentError.message = line.trim();
      }
    }

    // Capture stack trace (indented lines starting with "at ")
    if (currentError && inStackTrace && line.trim().startsWith('at ')) {
      currentError.stack += line.trim() + '\n';
    }

    // Stop collecting stack trace when we hit a blank line or new section
    if (inStackTrace && line.trim() === '') {
      inStackTrace = false;
    }
  }

  // Add the last error if exists
  if (currentError) {
    errors.push(currentError);
  }

  return { errors };
}

/**
 * Find line number of first scenario in feature file (happy path)
 *
 * @param {string} featureFile - Path to feature file
 * @returns {number|null} Line number (1-indexed) or null if not found
 *
 * @example
 * const line = getFirstScenarioLine('features/login.feature');
 * // Returns: 8 (line number of first "Scenario:")
 */
function getFirstScenarioLine(featureFile) {
  const fs = require('fs');
  const path = require('path');

  const fullPath = path.join(process.cwd(), featureFile);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('Scenario:')) {
      return i + 1; // Line numbers are 1-indexed
    }
  }

  return null;
}

/**
 * Find line number of scenario by name (partial match)
 *
 * @param {string} featureFile - Path to feature file
 * @param {string} scenarioName - Partial or full scenario name
 * @returns {number|null} Line number (1-indexed) or null if not found
 *
 * @example
 * const line = getScenarioLineByName('features/login.feature', 'Invalid password');
 * // Returns: 45 (line number where that scenario starts)
 */
function getScenarioLineByName(featureFile, scenarioName) {
  const fs = require('fs');
  const path = require('path');

  const fullPath = path.join(process.cwd(), featureFile);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const searchTerm = scenarioName.toLowerCase();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('Scenario:') && line.toLowerCase().includes(searchTerm)) {
      return i + 1;
    }
  }

  return null;
}

module.exports = {
  MAX_ITERATIONS,
  TEST_TIMEOUT,
  runBddTestWithTimeout,
  runBddScenarioWithTimeout,
  getFirstScenarioLine,
  getScenarioLineByName,
  parseTestProgress,
  findNewlyPassingSteps,
  extractErrors
};
