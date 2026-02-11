"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/server-actions/users"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(1, "Name is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response = await registerUser({
        ...values
      })
      if (!response.success) {
        throw new Error(response.message)
      } else {
        toast.success("User registered successfully")
        form.reset()
        router.push("/login")
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-sm p-5 sm:p-6 lg:p-8 w-full max-w-[500px] rounded-lg">
        <div className="text-lg sm:text-xl font-bold text-primary">
          Register your account
        </div>
        <hr className="my-4 sm:my-5 border border-gray-300" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2 pt-2">
              <span className="text-sm order-2 sm:order-1">
                Already have an account?{" "}
                <Link href={"/login"} className="text-primary underline">
                  Login
                </Link>
              </span>
              <Button
                disabled={loading}
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                REGISTER
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default RegisterPage