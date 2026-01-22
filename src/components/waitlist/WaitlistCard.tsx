'use client'

import { useState, useEffect } from 'react'

type Step = 'collapsed' | 'email' | 'newsletter' | 'success' | 'duplicate' | 'error'

interface WaitlistCardProps {
  onSubmit?: (data: { email: string; newsletter: boolean }) => Promise<void>
}

export function WaitlistCard({ onSubmit }: WaitlistCardProps) {
  const [step, setStep] = useState<Step>('collapsed')
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

  const handleExpand = () => {
    setStep('email')
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
    <div
      data-testid="waitlist-card"
      className="mt-12 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Collapsed state */}
      {step === 'collapsed' && (
        <div>
          <p className="text-sm text-gray-600 mb-3 text-center font-sans">
            Implement the Jetty Method for free with JettyPod
          </p>
          <button
            onClick={handleExpand}
            data-testid="waitlist-card-button"
            className="w-full px-4 py-2 bg-[#2c2c2c] text-white text-sm rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Join waitlist
          </button>
        </div>
      )}

      {/* Email step */}
      {step === 'email' && (
        <div>
          <p className="text-sm text-gray-600 mb-3 text-center font-sans">
            Reserve your spot. No junk.
          </p>
          <form onSubmit={handleEmailSubmit} className="space-y-2">
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              placeholder="you@example.com"
              data-testid="waitlist-email-input"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {emailError && (
              <p data-testid="waitlist-email-error" className="text-red-500 text-sm">
                {emailError}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#2c2c2c] text-white text-sm rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      )}

      {/* Newsletter step */}
      {step === 'newsletter' && (
        <div>
          <p className="text-sm text-gray-600 mb-3 font-sans">
            Want weekly vibe coding tips?
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleNewsletterChoice(true)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              Yes, sign me up
            </button>
            <button
              onClick={() => handleNewsletterChoice(false)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* Success state */}
      {step === 'success' && (
        <div className="text-center py-2">
          <div className="text-2xl mb-1">&#10003;</div>
          <p className="text-sm text-gray-600 font-sans">
            You're on the list!
          </p>
          <p className="text-sm text-gray-500 font-sans">
            You'll get a ping when your invite is ready.
          </p>
        </div>
      )}

      {/* Duplicate email message */}
      {step === 'duplicate' && (
        <div className="text-center py-2" data-testid="waitlist-duplicate-message">
          <div className="text-2xl mb-1">&#10003;</div>
          <p className="text-sm text-gray-600 font-sans">
            You're already on the list!
          </p>
          <p className="text-sm text-gray-500 font-sans">
            You'll get a ping when your invite is ready.
          </p>
        </div>
      )}

      {/* Error state */}
      {step === 'error' && (
        <div className="text-center py-2" data-testid="waitlist-error">
          <div className="text-2xl mb-1">&#9888;</div>
          <p className="text-sm text-gray-600 mb-3 font-sans">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={handleRetry}
            data-testid="waitlist-retry-button"
            className="w-full px-4 py-2 bg-[#2c2c2c] text-white text-sm rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
