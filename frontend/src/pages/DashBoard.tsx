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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>("");

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

    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpdate = async (id: number) => {
        if (!editedTitle.trim()) return;
        setLoading(true);
        try {
            const response = await axios.put(
                `${BACKEND_URL}/user/todo/${id}`,
                { title: editedTitle },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, title: response.data.todo.title } : todo
                )
            );
        } catch (error) {
            console.error("Failed to update todo:", error);
        } finally {
            setEditingId(null);
            setEditedTitle("");
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-200 flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-md w-[50vw]">
                <div className="flex justify-between mb-6">
                    <Input ref={inputRef} type="text" placeholder="Enter your todo"></Input>
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
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="bg-slate-300 rounded-md px-4 py-2 m-2 mx-0 flex items-center justify-between"
                        >
                            {editingId === todo.id ? (
                                <Input
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="flex-grow mr-4"
                                />
                            ) : (
                                <p>
                                    {todos.indexOf(todo) + 1}. {todo.title}
                                </p>
                            )}
                            <div className="flex items-center">
                                {editingId === todo.id ? (
                                    <Button
                                        className="mr-4"
                                        onClick={() => handleUpdate(todo.id)}
                                    >
                                        Save
                                    </Button>
                                ) : (
                                    <Button
                                        className="mr-4"
                                        onClick={() => {
                                            setEditingId(todo.id);
                                            setEditedTitle(todo.title);
                                        }}
                                    >
                                        Update
                                    </Button>
                                )}
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
                        </div>
                    ))}
                    {loading && <Skeleton className="h-10 w-full m-2" />}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
