import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BACKEND_URL } from "@/config"
import { Label } from "@radix-ui/react-label"

import axios from "axios"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const userNavigate = useNavigate();
    return (
        <div className="flex min-h-screen justify-center items-center bg-slate-200">
            {!loading ? <div className="bg-white p-8 w-[30vw] rounded-lg flex flex-col items-center">
                <h1 className="text-3xl mb-6 text-center font-extrabold">Signup</h1>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="username">Enter your username</Label></div>
                    <div><Input ref={usernameRef} id="username" type="text"/></div>
                </div>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="email">Enter your email</Label></div>
                    <div><Input ref={emailRef} id="email" type="text"/></div>
                </div>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="password">Enter your password</Label></div>
                    <div><Input ref={passwordRef} id="password" type="password"/></div>
                </div>
                <Button className="w-[30%] mt-6" onClick={async() => {
                    const username = usernameRef.current?.value;
                    const email = emailRef.current?.value;
                    const password = passwordRef.current?.value;
                    setLoading(true);
                    const response = await axios.post(`${BACKEND_URL}/signup`, {
                        username,
                        email,
                        password
                    });
                    localStorage.setItem("token", response.data.token);
                    setLoading(false);
                    userNavigate("/");
                }}>Signup</Button>
                <div className="text-slate-500 mt-4">Already have an account? <Link className="underline" to={"/signin"}>Signin</Link></div>
            </div> : <div>
            <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                        </div>
                </div>}
            
        </div>
    )
}

export default Signup