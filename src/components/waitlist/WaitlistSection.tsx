'use client'

import { useState } from 'react'

type Step = 'email' | 'experience' | 'success' | 'duplicate'
type ExperienceLevel = 'none' | 'some' | 'active'

interface WaitlistSectionProps {
  onSubmit?: (data: { email: string; experience: ExperienceLevel }) => Promise<void>
}

export function WaitlistSection({ onSubmit }: WaitlistSectionProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setStep('experience')
  }

  const handleExperienceSelect = async (experience: ExperienceLevel) => {
    setIsSubmitting(true)

    if (onSubmit) {
      await onSubmit({ email, experience })
      setIsSubmitting(false)
      setStep('success')
    } else {
      // Default: POST to API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, experience })
      })

      setIsSubmitting(false)

      const data = await response.json()
      if (data.error === 'duplicate') {
        setStep('duplicate')
      } else {
        setStep('success')
      }
    }
  }

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

        {/* Step 2: Experience Question */}
        {step === 'experience' && (
          <div data-testid="waitlist-experience-step">
            <p className="text-gray-600 mb-4 font-sans">
              One quick question:
            </p>
            <h3 className="text-xl font-semibold mb-6 font-serif">
              How much experience do you have with vibe coding?
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExperienceSelect('none')}
                disabled={isSubmitting}
                data-testid="waitlist-experience-option"
                data-value="none"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <span className="font-medium">None yet</span>
                <span className="text-gray-500 text-sm block">I'm curious but haven't tried it</span>
              </button>
              <button
                onClick={() => handleExperienceSelect('some')}
                disabled={isSubmitting}
                data-testid="waitlist-experience-option"
                data-value="some"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <span className="font-medium">Some experiments</span>
                <span className="text-gray-500 text-sm block">I've played around with AI coding tools</span>
              </button>
              <button
                onClick={() => handleExperienceSelect('active')}
                disabled={isSubmitting}
                data-testid="waitlist-experience-option"
                data-value="active"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <span className="font-medium">Actively using it</span>
                <span className="text-gray-500 text-sm block">I build things with AI regularly</span>
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
              We'll let you know when JettyPod is ready.
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
              We'll let you know when JettyPod is ready.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
