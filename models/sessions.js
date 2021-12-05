const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionsSchema = new Schema({
  sessionId:  String, // String is shorthand for {type: String}
  username:  String,
  accesstoken: String,
});

const Sessions = mongoose.model('sessions', sessionsSchema);

module.exports = Sessions;