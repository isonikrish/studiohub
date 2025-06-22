"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, LogOut, Plus } from "lucide-react"
import useApp from "@/stores/useApp"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

export function Navbar() {
  const { user } = useApp();
  const [data, setData] = useState({
    title: "", description: "", price: 0, duration: 0
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/package", {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration
      })
      if (res.status === 200) {
        toast.success("Package added successfully!")
        setData({ title: "", description: "", price: 0, duration: 0 }) // Reset form
      } else {
        toast.error("Failed to add package. Please try again.")
      }

    } catch (error) {
      toast.error("Failed to add package. Please try again.")
    }
  }
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="font-lora text-xl font-bold text-gray-900">StudioBook</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Browse Studios
                </Link>
                {user?.role === "PHOTOGRAPHER" && (

                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <span>Dashboard</span>
                  </Link>


                )}
                {user?.role === "PHOTOGRAPHER" && (

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus />Add Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Package</DialogTitle>
                        <DialogDescription>
                          Create a new studio package to offer your services.
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              type="text"
                              value={data.title}
                              onChange={(e) => setData({ ...data, title: e.target.value })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={data.description}
                              onChange={(e) => setData({ ...data, description: e.target.value })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={data.price}
                              onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={data.duration}
                              onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) })}
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full mt-4">
                            Submit Package
                          </Button>
                        </div>
                      </form>

                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Browse Studios
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="btn-primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
