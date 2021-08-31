const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

const Todo = mongoose.model('Todo',todoSchema)
module.exports = Todo