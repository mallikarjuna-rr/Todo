const mongoose = require('mongoose');
const { Schema } = mongoose;

const tasksSchema = new Schema({
  username:  String, // String is shorthand for {type: String}
  taskId:  String,
  taskName: String,
  description: String,
  status: String // COMPLETED, PENDING, INPROGRESS, YET_TO_START
});

const Tasks = mongoose.model('tasks', tasksSchema);

module.exports = Tasks;