const mongoose = require("mongoose")
const {Schema,model} = mongoose

const messageS = new Schema({
    message: Array
})

const message = model("messages",messageS)

module.exports = message