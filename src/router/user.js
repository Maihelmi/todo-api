const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
router.post('/users', async (req, res) => {
        const userIn = new User(req.body)
        try{
           await userIn.save()
           const token = await userIn.generateToken()
           res.status(200).send({userIn,token})
        }
        catch(e){
            res.status(400).send(e)
        }
     
})

// Login
router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.send({user,token})
    }
    catch(e){
        res.send('Try again ' + e)
    }
})

// get all

router.get('/users',auth, (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


// get by id 

router.get('/users/:id',auth, (req, res) => {
    console.log(req.params.id)

    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('Unable to find user')
        }
        
        res.status(200).send(user)
        
        res.status(200).send(user.password='')
    }).catch((e) => {
        res.status(500).send('Unable to connect to data base' + e)
    })
})

// logout

router.delete('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((el)=>{
         
            return el.token !== req.token
        })
        await req.user.save()
        res.send('Logout Successfully')
    }
    catch(e){
        res.send(e)
    }
})


// Delete 
router.delete('/users/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.send('No user is found')
        }
        res.send(user)
    }
    catch (e) {
        res.send(e)
    }
})

module.exports = router