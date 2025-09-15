"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginScreenProps {
  onNext: () => void
  onUpdateUser: (user: { name: string; email: string; phone: string }) => void
}

export default function LoginScreen({ onNext, onUpdateUser }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpSent, setOtpSent] = useState(false)
  const [otpExpired, setOtpExpired] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const generateOtp = () => {
    if (formData.name && formData.email && formData.phone) {
      setOtpSent(true)
      setOtpExpired(false)
      setResendCountdown(45)
      // Simulate OTP generation
      console.log("OTP sent to", formData.phone)
    }
  }

  const resendOtp = () => {
    if (resendCountdown === 0) {
      generateOtp()
    }
  }

  const handleLogin = () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      onUpdateUser(formData)
      onNext()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Login to Book Your Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="rounded-lg"
            />
            <Input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="rounded-lg"
            />
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-lg">
                <span className="text-sm text-muted-foreground">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="rounded-l-none"
              />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg rounded-lg"
                    maxLength={1}
                  />
                ))}
              </div>
              {otpExpired && <p className="text-destructive text-center text-sm">OTP Expired</p>}
            </div>
          )}

          <div className="space-y-3">
            {!otpSent ? (
              <Button
                onClick={generateOtp}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Generate OTP
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  disabled={otp.join("").length !== 6}
                >
                  Login
                </Button>
                <Button
                  onClick={resendOtp}
                  variant="outline"
                  className="w-full rounded-lg bg-transparent"
                  disabled={resendCountdown > 0}
                >
                  {resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : "Resend OTP"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
