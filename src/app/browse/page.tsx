"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import useApp from "@/stores/useApp"

export default function Browse() {
  const { user } = useApp()
  const [packages, setPackages] = useState<any[]>([])
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)
  const [description, setDescription] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const fetchPackages = async () => {
    try {
      const res = await axios.get("/api/package")
      setPackages(res.data)
    } catch (error) {
      setPackages([])
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const bookPackage = async () => {
    if (!selectedPackageId || !description || !selectedDate) {
      toast.error("Please fill in all booking details.")
      return
    }

    try {
      const res = await axios.post(`/api/booking`, {
        packageId: selectedPackageId,
        description,
        scheduledAt: selectedDate.toISOString(),
      })

      if (res.status === 200) {
        toast.success("Package booked successfully!")
        setDescription("")
        setSelectedPackageId(null)
        setSelectedDate(new Date())
        fetchPackages()
      } else {
        toast.error("Failed to book package. Please try again.")
      }
    } catch (error) {
      toast.error("Failed to book package. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-lora text-3xl md:text-4xl font-bold text-gray-900 mb-4">Studio Packages</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover professional studio packages from talented photographers in your area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const hasBooked = pkg.bookings?.some((booking: any) => booking.clientId === user?.id)

            return (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-video bg-gray-200 relative">
                  <img src={pkg.image || "/placeholder.svg"} alt={pkg.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 right-3 bg-white text-gray-900">${pkg.price}</Badge>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-lora text-xl mb-2">{pkg.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-3">{pkg.description}</CardDescription>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Duration: {pkg.duration} Minutes</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <Dialog>
                    {hasBooked ? (
                       <Button
                          className="w-full btn-secondary"
                          disabled
                        >
                          Booked
                        </Button>
                    ) : (
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setSelectedPackageId(pkg.id)
                            setSelectedDate(new Date())
                            setDescription("")
                          }}
                          className="w-full btn-secondary"
                        >
                          Book Now
                        </Button>
                      </DialogTrigger>
                    )}
                    <DialogContent>
                      <div className="p-6">
                        <h2 className="font-lora text-2xl font-semibold mb-4">Book Package</h2>
                        <p className="text-gray-700 mb-4">
                          You are about to book the package: <strong>{pkg.title}</strong>
                        </p>
                        <p className="text-gray-600 mb-4">
                          Price: <strong>${pkg.price}</strong>
                        </p>

                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">Select Date</label>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                          />
                        </div>

                        <Textarea
                          placeholder="Add a note for the photographer"
                          className="mb-4"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />

                        <Button
                          onClick={bookPackage}
                          className="w-full btn-primary"
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-lora text-xl font-semibold text-gray-900 mb-2">No packages available yet</h3>
            <p className="text-gray-600">Check back soon for new studio packages from photographers.</p>
          </div>
        )}
      </div>
    </div>
  )
}
