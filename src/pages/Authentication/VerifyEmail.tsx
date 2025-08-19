import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MailIcon, LoaderIcon } from 'lucide-react'

export function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (email) {
      setUserEmail(email)
    }
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multi-character input
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    try {
      const response = await fetch(`http://localhost:3000/v1/api/employerauth/signup/verify-email`, {
        // ${import.meta.env.VITE_SERVER_URL}
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          verificationCode: otp.join(''),
        }),
      })

      const data = await response.json()
      setIsVerifying(false)

      if (response.ok && data.success) {
        // Clear the stored email from localStorage since we don't need it anymore
        localStorage.removeItem('userEmail')
        // Navigate to login page
        navigate('/login')
      } else {
        console.error('Verification failed:', data.message)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setIsVerifying(false)
      // You might want to show an error message to the user here
    }
  }

  const handleResendCode = () => {
    if (resendTimer === 0) {
      // Simulate sending new code
      console.log('Resending code to:', userEmail)
      setResendTimer(30)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-lg">C</span>
            </div>
            <span className="text-white text-xl font-semibold">Coinomad</span>
          </div>
        </div>
        {/* Verification Form */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-3">
            Verify Your Email
          </h1>
          <div className="flex items-center gap-2 justify-center mb-6">
            <MailIcon className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-400">
              We sent a code to {userEmail}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={isVerifying || otp.some((digit) => digit === '')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className="text-yellow-400 hover:text-yellow-300 disabled:text-gray-500 text-sm font-medium transition-colors"
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : 'Resend code'}
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Use a different email address
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
