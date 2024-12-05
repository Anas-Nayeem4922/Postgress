

import { Client } from "pg";
import express from "express";
const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})

app.use(express.json());
const pgClient = new Client(connection);

pgClient.connect().then(() => {
    console.log("Connected to DB");
})

app.post("/signup", async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    try{
        const response = await pgClient.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`, [username, email, password]);
        const userId = response.rows[0].id;
        await pgClient.query(`INSERT INTO addresses (userId, address) VALUES ($1, $2);`, [userId, address]);
        res.json({
            msg : "Successfully signed up"
        })
    }catch(e) {
        res.json({
            e,
            msg : "Error while signing up"
        })
    }
});

app.get("/metadata", async(req, res) => {
    const id = req.query.id;
    const userInfo = await pgClient.query(`SELECT * FROM users WHERE id=$1`, [id]);
    const addressInfo = await pgClient.query(`SELECT * FROM addresses WHERE userId=$1`, [id]);
    res.json({
        user : userInfo.rows[0],
        address : addressInfo.rows
    })
})


