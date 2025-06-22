"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import Link from "next/link"
import useApp from "@/stores/useApp"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {fetchUser} = useApp();
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (!email || !password) {
            setError("Please fill in all fields")
            setIsLoading(false)
            return
        }

        try {
            const res = await axios.post("/api/login", { email, password })
            if (res.status === 200) {
                toast.success("Login successful! Redirecting...")
                fetchUser()
                setTimeout(() => {
                    router.push("/browse")
                }, 2000)
            }
        } catch (error) {
            toast.error("An error occurred while logging in. Please try again.")
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
                    <CardTitle className="font-lora text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your StudioHub account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Enter your password"
                            />
                        </div>

                        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Loading..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                                Signup
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
