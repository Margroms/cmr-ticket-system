"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import type { BookingData } from "@/app/page"

interface TicketSelectionScreenProps {
  bookingData: BookingData
  onNext: () => void
  onBack: () => void
  onUpdateTickets: (tickets: BookingData["tickets"]) => void
}

const ticketTypes = [
  { id: "solo", label: "Solo", price: 500 },
  { id: "couple", label: "Couple", price: 900 },
  { id: "group", label: "Group", price: 1800 },
] as const

export default function TicketSelectionScreen({
  bookingData,
  onNext,
  onBack,
  onUpdateTickets,
}: TicketSelectionScreenProps) {
  const [selectedType, setSelectedType] = useState<"solo" | "couple" | "group">(bookingData.tickets.type)
  const [ticketCount, setTicketCount] = useState(bookingData.tickets.count)

  const currentTicketType = ticketTypes.find((type) => type.id === selectedType)
  const pricePerTicket = currentTicketType?.price || 500
  const totalPrice = pricePerTicket * ticketCount

  const handleTypeChange = (type: "solo" | "couple" | "group") => {
    setSelectedType(type)
    const newTicketType = ticketTypes.find((t) => t.id === type)
    if (newTicketType) {
      const newTotalPrice = newTicketType.price * ticketCount
      onUpdateTickets({
        type,
        count: ticketCount,
        pricePerTicket: newTicketType.price,
        totalPrice: newTotalPrice,
      })
    }
  }

  const handleCountChange = (newCount: number) => {
    if (newCount >= 1 && newCount <= 10) {
      setTicketCount(newCount)
      const newTotalPrice = pricePerTicket * newCount
      onUpdateTickets({
        type: selectedType,
        count: newCount,
        pricePerTicket,
        totalPrice: newTotalPrice,
      })
    }
  }

  const handleProceed = () => {
    onUpdateTickets({
      type: selectedType,
      count: ticketCount,
      pricePerTicket,
      totalPrice,
    })
    onNext()
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Select Your Tickets</h1>
        </div>

        {/* Ticket Type Tabs */}
        <div className="mb-8">
          <div className="flex rounded-lg bg-muted p-1">
            {ticketTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedType === type.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Count Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Number of Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCountChange(ticketCount - 1)}
                disabled={ticketCount <= 1}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="text-3xl font-bold text-foreground min-w-[3rem] text-center">{ticketCount}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCountChange(ticketCount + 1)}
                disabled={ticketCount >= 10}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ticket Type:</span>
              <span className="font-medium capitalize">{selectedType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of Tickets:</span>
              <span className="font-medium">{ticketCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per Ticket:</span>
              <span className="font-medium">₹{pricePerTicket}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Price:</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleProceed}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-lg"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}
