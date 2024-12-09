import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_URL } from "@/config";
import { DeleteIcon } from "@/icons/Delete";
import axios from "axios";
import { useEffect, useRef, useState } from "react"

const DashBoard = () => {
    interface Todo {
        title : string,
        done : boolean,
        id : number
    }
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
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
                        const todoObj = {
                            title : response.data.todo.title,
                            done : response.data.todo.done,
                            id : response.data.todo.id
                        }
                        setTodos((prev) => ([...prev, todoObj]));
                        if(inputRef.current) {
                            inputRef.current.value = ""
                        }
                    }}>Add</Button></div>
                </div>
                <div className="flex flex-col justify-center">
                    {todos.map((todo : Todo, idx) => {
                        return !loading ? <div key={idx} className="bg-slate-300 rounded-md px-4 py-2 m-2 mx-0 flex justify-between">
                        <p>{idx + 1}. {todo.title}</p>
                        <div onClick={async() => {
                            setLoading(true);
                            await axios.delete(`${BACKEND_URL}/user/todo/${todo.id}`, {
                                headers : {
                                    "token" : localStorage.getItem("token")
                                }
                            })
                            setTodos((prev) => prev.filter((t) => t.id !== todo.id));
                            setLoading(false);
                        }}><DeleteIcon/></div>
                    </div> : <div key={idx}><Skeleton className="h-10 w-full m-2"/></div>
                    })}
                </div>
            </div>
        </div>
    )
}
export default DashBoard