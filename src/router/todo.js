const express = require('express')
const Todo = require('../models/todo')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/todos',auth,async(req,res)=>{
   
    const todo = new Todo({...req.body,createdBy:req.user._id})
    try{
        await todo.save()
        res.status(200).send(todo)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// get all

router.get('/todos',auth,async(req,res)=>{
    try{
       await req.user.populate('todos').execPopulate()
       res.send(req.user.todos)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// get by id

router.get('/todos/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
       
        const todo = await Todo.findOne({_id,createdBy:req.user._id})
        if(!todo){
            return res.status(404).send('Todo not found')
        }
        res.status(200).send(todo)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// patch
router.patch('/todos/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try{
       
        const todo = await Todo.findOne({_id,createdBy:req.user._id})
        if(!todo){
            return res.status(404).send('Todo is not found')
        }
        updates.forEach((update)=> todo[update] = req.body[update])
        await todo.save()
        res.send(todo)
    }
    catch(e){
        res.status(400).send(e)
    }

})

// Delete
router.delete('/todos/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const todo = await Todo.findOneAndDelete({_id,createdBy:req.user._id})
        if(!todo){
            return res.status(404).send('Todo is not found')
        }
        res.send(todo)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router