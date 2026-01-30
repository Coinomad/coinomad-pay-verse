import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MailIcon, LoaderIcon } from 'lucide-react'
import Logo from '../../components/Logo'
import { authAPI } from '../../Data/authAPI';

export function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()
  const [isResending, setIsResending] = useState(false)

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
      console.log('Attempting to verify email:', userEmail)
      const response = await authAPI.verifyEmail({
        email: userEmail,
        verificationCode: otp.join(''),
      });
  
      console.log('Full response:', response)
      console.log('Response data:', response.data)
      console.log('Response status:', response.status)
      
      const data = response.data;
      
      if (data.success) {
        console.log('Verification successful, redirecting to login...')
        // Clear the stored email from localStorage since we don't need it anymore
        localStorage.removeItem('userEmail')
        // Navigate to login page
        navigate('/login')
      } else {
        console.error('Verification failed:', data.message)
        alert(`Verification failed: ${data.message}`)
      }
    } catch (error: any) {
      console.error('Verification error details:', error)
      
      // Check if it's an axios error with response
      if (error.response) {
        console.log('Error response status:', error.response.status)
        console.log('Error response data:', error.response.data)
        
        // If the server responded with success but axios treated it as error
        if (error.response.status >= 200 && error.response.status < 300 && 
            error.response.data && error.response.data.success) {
          console.log('Server actually succeeded despite axios error, redirecting...')
          localStorage.removeItem('userEmail')
          navigate('/login')
          return
        }
        
        // Handle actual server errors
        const errorMessage = error.response.data?.message || 'Server error occurred'
        console.error('Server error:', errorMessage)
        alert(`Verification failed: ${errorMessage}`)
      } else if (error.request) {
        // This is a true network error (no response received)
        console.error('Network error - no response received:', error.request)
        alert('Network error: Unable to connect to server. Please check your internet connection and try again.')
      } else {
        // Something else happened
        console.error('Unexpected error:', error.message)
        alert(`Unexpected error: ${error.message}`)
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (resendTimer === 0 && !isResending) {
      setIsResending(true)
      try {
        console.log('Resending code to:', userEmail)
        console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000/v1/api')
        
        const response = await authAPI.resendVerificationCode(userEmail)
        
        if (response.data.success) {
          console.log('Verification code resent successfully')
          setResendTimer(30)
          // Success prompt instead of alert
          console.log('✅ Verification code sent successfully to', userEmail)
        } else {
          console.error('Failed to resend code:', response.data.message)
          // Keep error handling but remove alert
          console.error('❌ Failed to resend code:', response.data.message)
        }
      } catch (error) {
        console.error('Error resending code:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          request: error.request,
          config: error.config
        })
        
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Server error occurred'
          console.error('❌ Failed to resend code:', errorMessage)
        } else if (error.request) {
          console.error('❌ Network error: Unable to connect to server at', error.config?.baseURL, '. Please check if the backend server is running.')
        } else {
          console.error('❌ Unexpected error:', error.message)
        }
      } finally {
        setIsResending(false)
      }
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo />
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
              disabled={resendTimer > 0 || isResending}
              className="text-yellow-400 hover:text-yellow-300 disabled:text-gray-500 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : resendTimer > 0 ? (
                `Resend code in ${resendTimer}s`
              ) : (
                'Resend code'
              )}
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
