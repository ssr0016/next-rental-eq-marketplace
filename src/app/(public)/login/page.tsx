"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { loginUser } from "@/server-actions/users"
import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["user", "admin"], {
      error: "Please select a role",
    }),
  });



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response: any = await loginUser(values)
      if (!response.success) {
        throw new Error(response.message)
      }
      // console.log(response)
      Cookies.set("access_token", response.data)
      Cookies.set("role", values.role)

      toast.success("Login successfully")

      // Redirect to the dashboard based on the role
      router.push(`/${values.role}/dashboard`)
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    {
      value: "user",
      label: "User",
    },
    {
      value: "admin",
      label: "Admin",
    },
  ]

  return (
    <div className="auth-bg" >
      <div className="bg-white shadow-sm p-5 w-[500px] rounded-lg">
        <div className="text-xl font-bold! text-primary">Login to your account</div>
        <hr className="my-5 border border-gray-300" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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


            {/* ROLE RADIO GROUP */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>

                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-5"
                    >
                      {roles.map((role) => (
                        <FormItem
                          key={role.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={role.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm">
                Don't have an account?{" "}
                <Link href={"/register"} className="text-primary underline">
                  Register
                </Link >
              </span>
              <Button disabled={loading} type="submit">LOGIN</Button>
            </div>

          </form>
        </Form>
      </div>
    </div >
  )
}

export default LoginPage
