const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const jwt_SEC = "ImhereN$imnotgoinganywhere!!"


// Route 1 : create a user using POST '/api/auth/createUser'. No login required
router.post('/createUser', [
    // Validating entry fields
    body('name','Enter a valid name').notEmpty(), 
    body('email', 'enter a valid Email').isEmail(), 
    body('password','Password must contain atleast 8 characters').isLength({min:8}) ]
    , async (req, res)=>{

    let success = false;
    // return if its a bad request 
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    // check if the email is already taken or not
    try{
        // user with this email exist then return bad request 
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success, error: "This Email is taken"})
        }
        
        // salting - appending random string at the end of the password
        const salt = await bcrypt.genSalt(10);
        // hashing the the password and storing password as -> hash(password + salt)
        const jwt_SECPass = await bcrypt.hash(req.body.password, salt);
        
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: jwt_SECPass
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_SEC);
        success = true;

        res.json({success, authToken})
        // res.json(user)
    
    } catch (error){
        console.error(error.message)
        res.status(500).send('Internal Server error')
    }
    
})


// Route 2 : Authenticate a user POST '/api/auth/login'.
router.post('/login', [
    // Validating entry fields
    body('email', 'enter a valid Email').isEmail(), 
    body('password','Password must contain atleast 8 characters').exists() ]
    , async (req, res)=>{

    let success = false; 

    // return if its a bad request 
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({errors: result.array() });
    }

    try {
        let {email,password} = req.body;

        // check if the user with this email exist 
        let userE = await User.findOne({email});
        if(!userE){
            res.status(400).json({success, error:"login with correct credentials"});
        }
        // check if the password is correct, if not return bad request
        let passW = await bcrypt.compare(password, userE.password);
        if(!passW){
            res.status(400).json({success, error:"login with correct credentials"});
        }

        const data = {
            user: {
                id: userE.id
            }
        }
        const authToken = jwt.sign(data, jwt_SEC);
        success = true;
        res.json({success, authToken})

    } catch (error){
        console.error(error.message)
        res.status(500).send('Internal Server error')
    }
});
   

// Route 3 : Give user's detail POST '/api/auth/getUser'.
router.post('/getUser', fetchuser,async (req, res)=>{
   
    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error){
        console.error(error.message)
        res.status(500).send('Internal Server error')
    }
});

module.exports = router