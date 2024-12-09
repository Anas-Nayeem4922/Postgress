import express, { Request } from "express";
const app = express();
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "./middleware";
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
const port = 8080;


// Signup
app.post("/signup", async(req, res) => {
    const userSchema = z.object({
        username : z.string().min(3).max(10),
        email : z.string().email(),
        password : z.string().min(3).max(10)
    })
    const {success, error} = userSchema.safeParse(req.body);
    if(success) {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 3);
        const user = await client.user.create({
            data : {
                username,
                email,
                password : hashedPassword
            }
        })
        const token = jwt.sign({
            id : user.id.toString()
        }, JWT_SECRET as string)
        res.json({
            token
        })
    }else{
        res.status(411).json({
            msg : "Invalid schema",
            error
        })
    }
    
});

// Signin
app.post("/signin", async(req, res) => {
    const userSchema = z.object({
        email : z.string().email(),
        password : z.string().min(3).max(10)
    })
    const {success, error} = userSchema.safeParse(req.body);
    if(success) {
        const email = req.body.email;
        const foundUser = await client.user.findFirst({
            where : {
                email
            }
        })
        if(foundUser) {
            const password = req.body.password;
            const user = await bcrypt.compare(password, foundUser.password);
            if(user) {
                const token = jwt.sign({
                    id : foundUser.id.toString()
                }, JWT_SECRET as string)
                res.status(200).json({
                    token
                })
            }else{
                res.status(411).json({
                    msg : "Incorrect password"
                })
            }
        }else{
            res.status(411).json({
                msg : "Incorrect email"
            })
        }
    }else{
        res.status(411).json({
            msg : "Invalid schema",
            error
        })
    }
    
})

// Create a todo
app.post("/user/todo", auth, async(req : Request, res) => {
    const todoSchema = z.object({
        title : z.string().min(3)
    });
    const {success, error} = todoSchema.safeParse(req.body);
    const title = req.body.title;
    if(success) {
        await client.todo.create({
            data : {
                title,
                userId : parseInt(req.userId as string) 
            }
        })
        res.json({
            msg : "Todo added successfully"
        })
    }else{
        res.status(411).json({
            error
        })
    }
})

// Get all todos 
app.get("/user/todo", auth, async(req : Request, res) => {
    const todos = await client.todo.findMany({
        where : {
            userId : parseInt(req.userId as string)
        },
        select : {
            title : true,
            done : true
        }
    })
    res.status(200).json({
        todos
    })
});

//Update todo
app.put("/user/todo/:todoId", auth, async(req : Request, res) => {
    const {todoId} = req.params;
    const todo = await client.todo.findFirst({
        where : {
            id : parseInt(todoId)
        }
    })
    if(parseInt(req.userId as string) === todo?.userId) {
        
        const title = req.body.title;
        await client.todo.update({
            where : {
                id : parseInt(todoId)
            },
            data : {
                title
            }
        })
        res.json({
            msg : "Todo updated successfully"
        })
    }else{
        res.json({
            msg : "You don't have access to this todo"
        })
    }

})

// Delete todo
app.delete("/user/todo/:todoId", auth, async(req, res) => {
    const {todoId} = req.params;
    const todo = await client.todo.findFirst({
        where : {
            id : parseInt(todoId)
        }
    })
    if(parseInt(req.userId as string) === todo?.userId) {
        await client.todo.delete({
            where : {
                id : parseInt(todoId)
            }
        })
        res.json({
            msg : "Todo deleted successfully"
        })
    }else{
        res.json({
            msg : "You don't have access to this todo"
        })
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})

