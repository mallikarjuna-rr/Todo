const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const app = express();
const { checkSignupSchema, checkLoginSchema, tasksGetSchema } = require("./utils/schemaValidator");
const { registeredUsers } = require("./usersCollection");
const { verifyAuth } = require("./utils/verifyAuth");
const db = require('./db/dbConnection');
const usersModel = require('./models/users');
const sessionsModel = require('./models/sessions');
const tasksModel = require('./models/tasks');
app.use(express.json());


const generateJWT = (username) => {
    console.log("🚀 ~ file: app.js ~ line 11 ~ generateJWT ~ username", username)
    const token = jwt.sign({
        username: username
    }, 'thisissecret', { expiresIn: '1h' });
    return token;
}

app.post('/login', async (req, res) => {
    try {
        const payload = req.body;
        const { username, password } = payload;
        const isSchemaValid = await checkLoginSchema(payload);
        if (!isSchemaValid) {
            return res.status(400).send("Invalid Schema");
        }
        const user = await usersModel.findOne({ username: username }).exec();
        console.log("🚀 ~ file: app.js ~ line 29 ~ app.post ~ user", user)
        if (user.username === username && user.password === password) {
            const accessToken = generateJWT(username);
            console.log("🚀 ~ file: app.js ~ line 32 ~ app.post ~ accessToken", accessToken)
            // registeredUsers[i].accesstoken = accessToken;
            const sessionData = {
                sessionId: uuidv4(),
                username: username,
                accesstoken: accessToken
            }
            const session = new sessionsModel(sessionData);
            await session.save();
            return res.send(sessionData);
        }
        return res.status(400).send("Invalid username/password");
    } catch (err) {
        console.log("error: ", error);
        return res.status(400).send("Failed to login");
    }
})
app.post('/signup', async (req, res) => {
    try {
        const payload = req.body;
        const isSchemaValid = await checkSignupSchema(payload);
        if (!isSchemaValid) {
            return res.status(400).send("Invalid Schema");
        }
        // registeredUsers.push(payload);
        const user = new usersModel(payload);
        await user.save();
        return res.send(user);
    } catch (err) {
        res.status(400).send("Signup failed");
    }
})


app.get('/tasks', verifyAuth, async (req, res) => {
    try {
        const username = req.headers.username;
        const tasks = await tasksModel.find({ username: username });
        return res.send(tasks);
    } catch (err) {
        return res.status(400).send(err);
    }
})

app.post('/tasks', verifyAuth, async (req, res) => {
    try {
        const payload = req.body;
        const isSchemaValid = await tasksGetSchema(payload);
        if (!isSchemaValid) {
            return res.status(400).send("Schema not Valid");
        }
        const task = new tasksModel(payload);
        await task.save();
        return res.send(task);
    } catch (err) {
        res.status(400).send(err.msg);
    }
});



app.put('/tasks/:taskId', verifyAuth, async (req, res) => {
    try {
        const payload = req.body;
        const { taskId,taskName,description,status } = payload;
        const isSchemaValid = await tasksGetSchema(payload);
        if (!isSchemaValid) {
            return res.status(400).send("Schema not Valid");
        }
        const filter = {"taskId": taskId};
        const update = {"taskName": taskName, "description": description, "status": status}
        const task = await tasksModel.findOneAndUpdate(filter, update);
        if (!task) {
            return res.status(400).send("Task Id not found");
        }
        return res.send(task);
    } catch (err) {
        return res.status(400).send(err.msg);
    }

});

app.delete('/tasks/:taskId', verifyAuth, async (req, res) => {
    const taskId = req.params.taskId;
    const query = {"taskId" : taskId};
    const task = await tasksModel.findOneAndRemove(query);
    return res.send(task);
});

app.listen(3000);
