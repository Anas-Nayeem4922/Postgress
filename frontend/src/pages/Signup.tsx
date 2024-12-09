import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"


const Signup = () => {
    return (
        <div className="flex min-h-screen justify-center items-center bg-slate-200">
            <div className="bg-white p-8 w-[30vw] rounded-lg flex flex-col items-center">
                <h1 className="text-3xl mb-6 text-center font-extrabold">Signup</h1>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="username">Enter your username</Label></div>
                    <div><Input id="username" type="text"/></div>
                </div>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="email">Enter your email</Label></div>
                    <div><Input id="email" type="text"/></div>
                </div>
                <div className="m-4 w-[90%]">
                    <div className="font-semibold mb-2"><Label htmlFor="password">Enter your password</Label></div>
                    <div><Input id="password" type="password"/></div>
                </div>
                <Button className="w-[30%] mt-6">Signup</Button>
            </div>
        </div>
    )
}

export default Signup