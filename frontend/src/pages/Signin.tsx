import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_URL } from "@/config";
import { Label } from "@radix-ui/react-label"
import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Signin = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const userNavigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    return (
        <div className="flex min-h-screen justify-center items-center bg-slate-200">
            {!loading ? <div className="bg-white p-8 w-[30vw] rounded-lg flex flex-col items-center">
                <h1 className="text-3xl mb-6 text-center font-extrabold">Signin</h1>
                {error && <p className="text-red-700">Invalid credentials!</p>}
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="email">Enter your email</Label></div>
                    <div><Input placeholder="Enter your email" ref={emailRef} id="email" type="text"/></div>
                </div>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="password">Enter your password</Label></div>
                    <div><Input placeholder="Password must contain more than 3 characters" ref={passwordRef} id="password" type="password"/></div>
                </div>
                <Button className="w-[30%] mt-6" onClick={async() => {
                    const email = emailRef.current?.value;
                    const password = passwordRef.current?.value;
                    setLoading(true);
                    try{
                        const response = await axios.post(`${BACKEND_URL}/signin`, {
                            email,
                            password
                        });
                        localStorage.setItem("token", response.data.token);
                        setLoading(false);
                        userNavigate("/");
                    }catch(e) {
                        setLoading(false);
                        setError(true);
                    }
                }}>Signin</Button>
                <div className="text-slate-500 mt-4">Don't have an account? <Link className="underline" to={"/signup"}>Signup</Link></div>
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

export default Signin