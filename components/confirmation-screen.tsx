"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Home } from "lucide-react"
import type { BookingData } from "@/app/page"

interface ConfirmationScreenProps {
  bookingData: BookingData
  onHome: () => void
}

export default function ConfirmationScreen({ bookingData, onHome }: ConfirmationScreenProps) {
  const [ticketNumber, setTicketNumber] = useState("")

  useEffect(() => {
    // Generate ticket number when component mounts
    const generateTicketNumber = () => {
      const prefix = "TKT"
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.random().toString(36).substring(2, 5).toUpperCase()
      return `${prefix}${timestamp}${random}`
    }

    setTicketNumber(generateTicketNumber())
  }, [])

  const handleDownloadTicket = () => {
    // Simulate PDF download
    console.log("Downloading ticket PDF...")
    alert("Ticket PDF download started!")
  }

  const handleSendEmail = () => {
    // Simulate email sending
    console.log("Sending ticket to email...")
    alert(`Ticket sent to ${bookingData.user.email}!`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your tickets have been successfully booked</p>
        </div>

        {/* Ticket Details Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Ticket Number</p>
                <p className="font-mono font-bold text-primary">{ticketNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm">{bookingData.payment.transactionId}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm">Event Name</p>
                  <p className="font-semibold">{bookingData.booking.eventName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Date</p>
                    <p className="font-medium">{formatDate(bookingData.booking.date)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Time</p>
                    <p className="font-medium">{bookingData.booking.time}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Venue</p>
                  <p className="font-medium">{bookingData.booking.venue}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Ticket Type</p>
                    <p className="font-medium capitalize">{bookingData.tickets.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Number of Tickets</p>
                    <p className="font-medium">{bookingData.tickets.count}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Section */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                {/* QR Code placeholder - in a real app, this would be a generated QR code */}
                <div className="w-24 h-24 bg-foreground rounded grid grid-cols-8 gap-px p-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`${Math.random() > 0.5 ? "bg-background" : "bg-foreground"} rounded-sm`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Please present this QR code at the event gate.</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleDownloadTicket}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Ticket (PDF)
          </Button>

          <Button onClick={handleSendEmail} variant="outline" className="w-full py-3 rounded-lg bg-transparent">
            <Mail className="h-5 w-5 mr-2" />
            Send to Email
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button onClick={onHome} variant="link" className="text-primary hover:text-primary/80">
            <Home className="h-4 w-4 mr-2" />
            Home / Book Again
          </Button>
        </div>
      </div>
    </div>
  )
}
