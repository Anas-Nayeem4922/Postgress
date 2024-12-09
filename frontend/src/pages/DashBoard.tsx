import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react"

const DashBoard = () => {
    interface Todo {
        title : string,
        done : boolean
    }
    const [todos, setTodos] = useState<Todo[]>([]);
    async function getTodos() {
        const response = await axios.get(`${BACKEND_URL}/user/todo`, {
            headers : {
                "token" : localStorage.getItem("token")
            }
        })
        setTodos(response.data.todos);
    }
    useEffect(() => {
        getTodos();
    }, []);
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="bg-slate-200 flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-md w-[50vw]">
                <div className="flex justify-between mb-6">
                    <Input ref={inputRef} type="text" placeholder="Enter your todo"></Input>
                    <div className="ml-6"><Button onClick={async() => {
                        const response = await axios.post(`${BACKEND_URL}/user/todo`, {
                            title : inputRef.current?.value
                        }, {
                            headers : {
                                "token" : localStorage.getItem("token")
                            }
                        })
                        console.log(response.data);
                        const todoObj = {
                            title : response.data.todo.title,
                            done : false
                        }
                        setTodos((prev) => ([...prev, todoObj]));
                        if(inputRef.current) {
                            inputRef.current.value = ""
                        }
                    }}>Add</Button></div>
                </div>
                <div className="flex flex-col justify-center">
                    {todos.map((todo : {title : string, done : boolean}, idx) => {
                        return <div key={idx} className="bg-slate-300 rounded-md px-4 py-2 m-2 mx-0">
                            <p>{idx + 1}. {todo.title}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
export default DashBoard