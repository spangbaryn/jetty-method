'use client'

import { useState } from 'react'

type Step = 'collapsed' | 'email' | 'experience' | 'success' | 'duplicate'
type ExperienceLevel = 'none' | 'some' | 'active'

interface WaitlistCardProps {
  onSubmit?: (data: { email: string; experience: ExperienceLevel }) => Promise<void>
}

export function WaitlistCard({ onSubmit }: WaitlistCardProps) {
  const [step, setStep] = useState<Step>('collapsed')
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
    setStep('experience')
  }

  const handleExperienceSelect = async (experience: ExperienceLevel) => {
    setIsSubmitting(true)

    if (onSubmit) {
      await onSubmit({ email, experience })
      setIsSubmitting(false)
      setStep('success')
    } else {
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
    <div
      data-testid="waitlist-card"
      className="mt-12 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Collapsed state */}
      {step === 'collapsed' && (
        <div>
          <p className="text-sm text-gray-600 mb-3 text-right font-sans">
            Implement the Jetty Method with JettyPod
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
          <p className="text-sm text-gray-600 mb-3 font-sans">
            JettyPod is a free tool for implementing the Jetty Method.
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

      {/* Experience step */}
      {step === 'experience' && (
        <div>
          <p className="text-sm text-gray-600 mb-3 font-sans">
            Vibe coding experience?
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleExperienceSelect('none')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              None yet
            </button>
            <button
              onClick={() => handleExperienceSelect('some')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              Some experiments
            </button>
            <button
              onClick={() => handleExperienceSelect('active')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              Actively using it
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
        </div>
      )}

      {/* Duplicate email message */}
      {step === 'duplicate' && (
        <div className="text-center py-2" data-testid="waitlist-duplicate-message">
          <div className="text-2xl mb-1">&#10003;</div>
          <p className="text-sm text-gray-600 font-sans">
            You're already on the list!
          </p>
        </div>
      )}
    </div>
  )
}
