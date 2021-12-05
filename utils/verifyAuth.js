const jwt = require('jsonwebtoken');

const { registeredUsers } = require("../usersCollection");
const sessionsModel = require('../models/sessions');

const checkToken = async (sessionId, username, token) => {
console.log("🚀 ~ file: verifyAuth.js ~ line 7 ~ checkToken ~ username", username)
console.log("🚀 ~ file: verifyAuth.js ~ line 7 ~ checkToken ~ sessionId", sessionId)
console.log("🚀 ~ file: verifyAuth.js ~ line 7 ~ checkToken ~ token", token)
    const session = await sessionsModel.findOne({ sessionId: sessionId }).exec();
    console.log("🚀 ~ file: verifyAuth.js ~ line 8 ~ checkToken ~ session", session)
    if(session.username === username && session.accesstoken === token) {
        return true;
    }
    return false;
}

const verifyAuth = async (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers['x-access-token'];
        const username = req.headers.username;
        const sessionId = req.headers.sessionid;
        const decoded = jwt.decode(token);
        const { exp } = decoded;
        console.log("🚀 ~ file: verifyAuth.js ~ line 8 ~ verifyAuth ~ decoded", decoded)
        const curTimestamp = Math.floor(Date.now()/1000); 
        const isValid = await checkToken(sessionId, username, token);
        console.log("🚀 ~ file: verifyAuth.js ~ line 23 ~ verifyAuth ~ isValid", isValid)
        if(isValid) {
            if(exp < curTimestamp) {
                console.log("expired");
                return res.status(401).send("Invalid accesstoken");
            }
            next();
        } else {
            return res.status(401).send("Invalid accessToken")
        }
    } catch(err) {
        console.log("🚀 ~ file: verifyAuth.js ~ line 32 ~ verifyAuth ~ err", err)
        return res.status(401).send("Invalid accessToken")
    }
}

module.exports = {
    verifyAuth
}