"use client"

import type React from "react"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "lucide-react"
import { toast } from "sonner"

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<any>("CLIENT")
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (!name || !email || !password) {
            setError("Please fill in all fields")
            setIsLoading(false)
            return
        }

        try {
            const res = await axios.post("/api/signup", { name, email, password, role });
            if (res.status === 200) {
                toast.success("Account created successfully! Redirecting to login...")
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }

        } catch (error) {
            toast.error("An error occurred while creating your account. Please try again.")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Camera className="h-12 w-12 text-blue-600" />
                    </div>
                    <CardTitle className="font-lora text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Join StudioHub and start booking professional studios</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Create a password"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">I am a...</Label>
                            <Select value={role} onValueChange={(value: any) => setRole(value)}>
                                <SelectTrigger className="input-field">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENT">Client (Looking to book studios)</SelectItem>
                                    <SelectItem value="PHOTOGRAPHER">Photographer (Offering studio packages)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                        <Button type="submit" disabled={isLoading} className="w-full btn-primary">
                            {isLoading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
