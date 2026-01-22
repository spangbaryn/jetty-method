'use client'

import { useState, useEffect } from 'react'

type Step = 'email' | 'newsletter' | 'success' | 'duplicate' | 'error'

interface WaitlistSectionProps {
  onSubmit?: (data: { email: string; newsletter: boolean }) => Promise<void>
}

export function WaitlistSection({ onSubmit }: WaitlistSectionProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(true) // Start true to prevent flash

  useEffect(() => {
    setHasSubmitted(localStorage.getItem('waitlist_submitted') === 'true')
  }, [])

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }
    setEmailError('')
    setStep('newsletter')
  }

  const handleNewsletterChoice = async (wantsNewsletter: boolean) => {
    setIsSubmitting(true)

    if (onSubmit) {
      try {
        await onSubmit({ email, newsletter: wantsNewsletter })
        setIsSubmitting(false)
        localStorage.setItem('waitlist_submitted', 'true')
        setStep('success')
      } catch {
        setIsSubmitting(false)
        setStep('error')
      }
    } else {
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newsletter: wantsNewsletter })
        })

        setIsSubmitting(false)

        const data = await response.json()
        if (data.error === 'duplicate') {
          localStorage.setItem('waitlist_submitted', 'true')
          setStep('duplicate')
        } else if (!response.ok) {
          setStep('error')
        } else {
          localStorage.setItem('waitlist_submitted', 'true')
          setStep('success')
        }
      } catch {
        setIsSubmitting(false)
        setStep('error')
      }
    }
  }

  const handleRetry = () => {
    setStep('newsletter')
  }

  if (hasSubmitted) return null

  return (
    <section
      data-testid="waitlist-section"
      className="border-t border-gray-200 pt-12 mt-8"
    >
      <div className="max-w-md mx-auto text-center">
        {/* Step 1: Email */}
        {step === 'email' && (
          <div>
            <h2 className="text-2xl font-bold mb-3 font-serif">
              JettyPod
            </h2>
            <p className="text-gray-600 mb-6 font-sans">
              A free tool for implementing the Jetty Method.<br />Join the waitlist.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2" data-testid="waitlist-form">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  placeholder="you@example.com"
                  data-testid="waitlist-email-input"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="submit"
                  data-testid="waitlist-join-button"
                  className="px-6 py-3 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium"
                >
                  Join
                </button>
              </div>
              {emailError && (
                <p data-testid="waitlist-email-error" className="text-red-500 text-sm text-left">
                  {emailError}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Step 2: Newsletter Question */}
        {step === 'newsletter' && (
          <div data-testid="waitlist-newsletter-step">
            <p className="text-gray-600 mb-4 font-sans">
              One more thing:
            </p>
            <h3 className="text-xl font-semibold mb-6 font-serif">
              Want a weekly email with vibe coding tips?
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleNewsletterChoice(true)}
                disabled={isSubmitting}
                data-testid="waitlist-newsletter-yes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <span className="font-medium">Yes, sign me up</span>
                <span className="text-gray-500 text-sm block">I'd like weekly tips and updates</span>
              </button>
              <button
                onClick={() => handleNewsletterChoice(false)}
                disabled={isSubmitting}
                data-testid="waitlist-newsletter-no"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <span className="font-medium">No thanks</span>
                <span className="text-gray-500 text-sm block">Just the waitlist for now</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div data-testid="waitlist-success">
            <div className="text-4xl mb-4">&#10003;</div>
            <h3 className="text-xl font-semibold mb-2 font-serif">
              You're on the list!
            </h3>
            <p className="text-gray-600 font-sans">
              You'll get a ping when your invite is ready.
            </p>
          </div>
        )}

        {/* Duplicate email message */}
        {step === 'duplicate' && (
          <div data-testid="waitlist-duplicate-message">
            <div className="text-4xl mb-4">&#10003;</div>
            <h3 className="text-xl font-semibold mb-2 font-serif">
              You're already on the list!
            </h3>
            <p className="text-gray-600 font-sans">
              You'll get a ping when your invite is ready.
            </p>
          </div>
        )}

        {/* Error state */}
        {step === 'error' && (
          <div data-testid="waitlist-error">
            <div className="text-4xl mb-4">&#9888;</div>
            <h3 className="text-xl font-semibold mb-2 font-serif">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-4 font-sans">
              We couldn't add you to the waitlist. Please try again.
            </p>
            <button
              onClick={handleRetry}
              data-testid="waitlist-retry-button"
              className="px-6 py-3 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
