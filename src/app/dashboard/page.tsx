"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Dashboard() {
  const [allBookings, setAllBookings] = useState<any[]>([])

  const fetchBookings = async () => {
    const response = await axios.get("/api/dashboard")
    if (response.status === 200) {
      setAllBookings(response.data)
    }
  }

  const handleStatusChange = async (bookingId: number, status: "CONFIRMED" | "CANCELLED") => {
    if (status === "CANCELLED") {
      const confirm = window.confirm("Are you sure you want to cancel this booking?")
      if (!confirm) return
      try {
        await axios.put(`/api/booking/cancel`, {
          bookingId: bookingId,
        })
        toast.success(`Booking ${status.toLowerCase()} successfully!`)
        fetchBookings()
      } catch (error) {
        toast.error("Something went wrong while updating the booking.")
      }
    }
    if (status === "CONFIRMED") {
      const confirm = window.confirm("Are you sure you want to confirm this booking?")
      if (!confirm) return
      try {
        await axios.put(`/api/booking/confirm`, {
          bookingId: bookingId,
        })
        toast.success(`Booking ${status.toLowerCase()} successfully!`)
        fetchBookings()
      } catch (error) {
        toast.error("Something went wrong while updating the booking.")
      }
    }


  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Photographer Dashboard</h1>

      {allBookings.map((pkg) => (
        <Card key={pkg.id} className="mb-6">
          <CardHeader>
            <CardTitle>{pkg.title}</CardTitle>
            <p className="text-gray-500 text-sm">{pkg.description}</p>
          </CardHeader>
          <CardContent>
            {pkg.bookings.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No bookings yet.</p>
            ) : (
              pkg.bookings.map((booking: any) => (
                <div key={booking.id} className="border-t py-4 space-y-2">
                  <div className="flex justify-between items-center flex-wrap">
                    <div className="space-y-1">
                      <p className="text-md">
                        <strong>Client:</strong> {booking.client.name} ({booking.client.email})
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Scheduled At:</strong>{" "}
                        {new Date(booking.scheduledAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> {booking.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Badge
                        variant="outline"
                        className={`capitalize ${booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {booking.status.toLowerCase()}
                      </Badge>
                      {booking.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
