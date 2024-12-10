import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_URL } from "@/config";
import { DeleteIcon } from "@/icons/Delete";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const DashBoard = () => {
    interface Todo {
        title: string;
        done: boolean;
        id: number;
    }
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [todoId, setTodoId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const todoRef = useRef<HTMLInputElement>(null);

    async function getTodos() {
        const response = await axios.get(`${BACKEND_URL}/user/todo`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        });
        setTodos(response.data.todos);
    }

    useEffect(() => {
        getTodos();
    }, []);

    const handleUpdate = async () => {
        if (todoRef.current && todoId !== null) {
            const updatedTitle = todoRef.current.value;
            const response = await axios.put(
                `${BACKEND_URL}/user/todo/${todoId}`,
                { title: updatedTitle },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );

            if (response.data.msg === "Todo updated successfully") {
                setTodos((prev) =>
                    prev.map((todo) =>
                        todo.id === todoId ? { ...todo, title: updatedTitle } : todo
                    )
                );
                setTodoId(null);
            }
        }
    };

    return (
        <div className="bg-slate-200 flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-md w-[50vw]">
                <div className="flex justify-between mb-6">
                    <Input ref={inputRef} type="text" placeholder="Enter your todo" />
                    <div className="ml-6">
                        <Button
                            onClick={async () => {
                                const response = await axios.post(
                                    `${BACKEND_URL}/user/todo`,
                                    {
                                        title: inputRef.current?.value,
                                    },
                                    {
                                        headers: {
                                            token: localStorage.getItem("token"),
                                        },
                                    }
                                );
                                const todoObj = {
                                    title: response.data.todo.title,
                                    done: response.data.todo.done,
                                    id: response.data.todo.id,
                                };
                                setTodos((prev) => [...prev, todoObj]);
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                }
                            }}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    {todos.map((todo: Todo, idx) =>
                        !loading ? (
                            <div
                                key={idx}
                                className="bg-slate-300 rounded-md px-4 py-2 m-2 mx-0 flex items-center justify-between"
                            >
                                {todoId !== todo.id ? (
                                    <>
                                        <p>
                                            {idx + 1}. {todo.title}
                                        </p>
                                        <div className="flex items-center">
                                            <Button
                                                className="mr-4"
                                                onClick={() => {
                                                    if (todoRef.current) {
                                                        todoRef.current.value = todo.title;
                                                    }
                                                    setTodoId(todo.id);
                                                }}
                                            >
                                                Update
                                            </Button>
                                            <div
                                                onClick={async () => {
                                                    setLoading(true);
                                                    await axios.delete(
                                                        `${BACKEND_URL}/user/todo/${todo.id}`,
                                                        {
                                                            headers: {
                                                                token: localStorage.getItem("token"),
                                                            },
                                                        }
                                                    );
                                                    setTodos((prev) =>
                                                        prev.filter((t) => t.id !== todo.id)
                                                    );
                                                    setLoading(false);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full flex items-center justify-between">
                                        <Input
                                            ref={todoRef}
                                            defaultValue={todo.title}
                                            className="w-[85%] bg-slate-300 border-none"
                                        />
                                        <Button
                                            className="w-[10%]"
                                            onClick={handleUpdate}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div key={idx}>
                                <Skeleton className="h-10 w-full m-2" />
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
