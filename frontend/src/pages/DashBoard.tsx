import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"

const DashBoard = () => {
    const [todos, setTodos] = useState([]);
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="bg-slate-200 flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-md w-[50vw]">
                <div className="flex justify-between">
                    <Input ref={inputRef} type="text" placeholder="Enter your todo"></Input>
                    <div className="ml-6"><Button onClick={() => {
                        console.log(inputRef.current?.value);
                        if(inputRef.current) {
                            inputRef.current.value = ""
                        }
                    }}>Add</Button></div>
                </div>
                <div>
                    {todos.map((todo, idx) => {
                        return <li key={idx}>{todo}</li>
                    })}
                </div>
            </div>
        </div>
    )
}
export default DashBoard