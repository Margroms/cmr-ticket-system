"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone, Wallet, Building2 } from "lucide-react"
import type { BookingData } from "@/app/page"

interface PaymentScreenProps {
  bookingData: BookingData
  onNext: () => void
  onBack: () => void
  onUpdatePayment: (payment: BookingData["payment"]) => void
}

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Cards", icon: CreditCard },
  { id: "wallet", label: "Wallets", icon: Wallet },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
]

export default function PaymentScreen({ bookingData, onNext, onBack, onUpdatePayment }: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handlePayment = async () => {
    if (!selectedMethod) return

    setPaymentStatus("processing")
    setStatusMessage("Processing payment...")

    // Simulate payment processing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2 // 80% success rate for demo

      if (isSuccess) {
        const transactionId = `TXN${Date.now()}`
        setPaymentStatus("success")
        setStatusMessage("Payment Successful!")
        onUpdatePayment({
          method: selectedMethod,
          transactionId,
        })

        // Auto-navigate to confirmation after success
        setTimeout(() => {
          onNext()
        }, 2000)
      } else {
        setPaymentStatus("failed")
        setStatusMessage("Payment Failed. Please try again.")
      }
    }, 2000)
  }

  const handleCancel = () => {
    setPaymentStatus("idle")
    setStatusMessage("")
    onBack()
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-3"
            disabled={paymentStatus === "processing"}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Payment</h1>
        </div>

        {/* Amount Display */}
        <Card className="mb-6 bg-primary text-primary-foreground">
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Total Amount Payable</p>
              <p className="text-3xl font-bold">₹{bookingData.tickets.totalPrice}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={paymentStatus === "processing"}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    } ${paymentStatus === "processing" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Icon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Event:</span>
              <span>{bookingData.booking.eventName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ticket Type:</span>
              <span className="capitalize">{bookingData.tickets.type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{bookingData.tickets.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date & Time:</span>
              <span>
                {bookingData.booking.date} at {bookingData.booking.time}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        {statusMessage && (
          <div className="mb-6 text-center">
            <p
              className={`text-sm font-medium ${
                paymentStatus === "success"
                  ? "text-green-600"
                  : paymentStatus === "failed"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {statusMessage}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || paymentStatus === "processing" || paymentStatus === "success"}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-lg"
          >
            {paymentStatus === "processing" ? "Processing..." : `Pay ₹${bookingData.tickets.totalPrice}`}
          </Button>

          {paymentStatus !== "success" && (
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={paymentStatus === "processing"}
              className="w-full py-3 rounded-lg text-lg bg-transparent"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
