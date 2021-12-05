const Ajv = require("ajv")

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const signupSchema = {
  type: "object",
  required: ["firstName", "lastName", "username", "email", "password"],
  properties: {
    firstName: {type: "string"},
    lastName: {type: "string"},
    username: {type: "string"},
    email: {type: "string"},
    password: {type: "string"},
    age: {type: "integer"},
    address:{type: "string"}
  },
  additionalProperties: false,
}

const loginSchema = {
    type: "object",
    required: ["username", "password"],
    properties: {
        username: {type: "string"},
        password: {type: "string"}
    },
    additionalProperties: false,

}

const taskSchema = {
    type: "object",
    required: ["username", "taskId", "task", "description", "status"],
    properties: {
        username: {type: "string"},
        taskId: {type: "integer"},
        task: {type: "string"},
        description: {type: "string"},
        status: {type: "string"}
    },
    additionalProperties: false,

}


const checkSignupSchema = async(payload) => {
    try {
        const validate = ajv.compile(signupSchema);
        const valid = validate(payload)
        if (!valid){
            console.log("Signup schema error: ",validate.errors)
            return false;
        }
        return true;
    } catch (err) {
        return err;
    }
}

const checkLoginSchema = async(payload) => {
    try {
        const validate = ajv.compile(loginSchema);
        const valid = validate(payload)
        if (!valid){
            console.log("login schema error: ",validate.errors)
            return false;
        }
        return true;
    } catch (err) {
        return err;
    }
}

const tasksGetSchema = async(payload) => {
    try {
        const validate = ajv.compile(taskSchema);
        const valid = validate(payload)
        if (!valid){
            console.log("login schema error: ",validate.errors)
            return false;
        }
        return true;
    } catch (err) {
        return err;
    }
}

module.exports = {
    checkSignupSchema,
    checkLoginSchema,
    tasksGetSchema
}