import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useState } from "react"
import Alert from "@/components/custom/Alert"
import LoadingSpinner from "@/components/custom/LoadingSpinner"
import { useDispatch } from "react-redux"
import { login } from "@/store/authSlice"
import { Link, useNavigate } from "react-router-dom"


export default function Login() {

  const navigate=useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()
  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
  console.log("Sending login payload:", data)
  try {
const res = await axios.post("http://localhost:8000/api/v1/users/login", data, { withCredentials: true })

    console.log("Login response:", res.data.data.user)
    dispatch(login(res.data.data.user))
    setLoading(false)
    // navigate("/")



  } catch (err) {

    if(err.response)
    {
          setError(err.response.data.message)
          setLoading(false)

    }
    else
    {
      setError("something went wrong, please try again")
      setLoading(false)

    }
    // console.error("Login failed:", err.response.data)
    // setError(err.response?.data?.message)
  }
  reset()
}
  

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
            
          </CardDescription>
          <CardAction>
            <Link to={"/signup"}>Sign Up</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <span className="text-red-600 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-4">
              {error && (
                              <Alert message={error}/>

              )}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading? <LoadingSpinner/>:<h1>Login</h1>}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
