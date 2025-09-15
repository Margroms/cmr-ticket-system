"use client"

import { useState } from "react"
import LoginScreen from "@/components/login-screen"
import TicketSelectionScreen from "@/components/ticket-selection-screen"
import PaymentScreen from "@/components/payment-screen"
import ConfirmationScreen from "@/components/confirmation-screen"

export type Screen = "login" | "tickets" | "payment" | "confirmation"

export interface BookingData {
  user: {
    name: string
    email: string
    phone: string
  }
  tickets: {
    type: "solo" | "couple" | "group"
    count: number
    pricePerTicket: number
    totalPrice: number
  }
  payment: {
    method: string
    transactionId: string
  }
  booking: {
    ticketNumber: string
    eventName: string
    date: string
    time: string
    venue: string
  }
}

export default function TicketBookingApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [bookingData, setBookingData] = useState<BookingData>({
    user: { name: "", email: "", phone: "" },
    tickets: { type: "solo", count: 1, pricePerTicket: 500, totalPrice: 500 },
    payment: { method: "", transactionId: "" },
    booking: {
      ticketNumber: "",
      eventName: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "6:00 PM",
      venue: "Central Park Amphitheater",
    },
  })

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "login" && (
        <LoginScreen onNext={() => navigateToScreen("tickets")} onUpdateUser={(user) => updateBookingData({ user })} />
      )}
      {currentScreen === "tickets" && (
        <TicketSelectionScreen
          bookingData={bookingData}
          onNext={() => navigateToScreen("payment")}
          onBack={() => navigateToScreen("login")}
          onUpdateTickets={(tickets) => updateBookingData({ tickets })}
        />
      )}
      {currentScreen === "payment" && (
        <PaymentScreen
          bookingData={bookingData}
          onNext={() => navigateToScreen("confirmation")}
          onBack={() => navigateToScreen("tickets")}
          onUpdatePayment={(payment) => updateBookingData({ payment })}
        />
      )}
      {currentScreen === "confirmation" && (
        <ConfirmationScreen bookingData={bookingData} onHome={() => navigateToScreen("login")} />
      )}
    </div>
  )
}
