//auth routes

const express = require('express');
const userSchema = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorize = require('../middleware/auth');     //Authentication middleware that we created

const router = express.Router();

//For Sign-In
router.post('/signin',(req,res,next)=>{
    let getUser;                      //let allows to declare vars that are limited to the scope of a block statement

    userSchema.findOne({            //functin in mongoose
        email: req.body.email       //get the email from the req body
    })
    .then(user => {
        if (!user){     //if no user
            return res.status((401).json({          //parse to json file
                message: "Authentication failed"
            }))
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password)     //compare the password
    })
    .then(response => {
        if(!response){
            return res.status(401).json({           //wrong password
                message: "Authentication Faild"
            })
        }

        //on sucessful auth the server creates a JET token or else an error
        let jwtToken = jwt.sign({           //Auth sucess (This is about jwt)
            email: getUser.email,           // .sign takes the payload, secret and option
            userId: getUser._id
        },"longer-secret-is-better",{
            expiresIn: '2h'                    //after 2h token is expired
        })

        res.status(200).json({          
            token: jwtToken,        //client gets the JWT token in the response body
            expiresIn: 6600,        //client stores that token in local storage
            msg: getUser
        })
        /*
        .catch((err)=>{                         //this should come after then --> check (When I add here when the req body is not with name it gives an error)
            return res.status(401).json({
                message: "Authentication Failed"
            })
        })
        */
        /*
        Form the next time, the client for making any req supplies the JWT token in req headers
        Server upon receiving the JWT validates it and sends sucessful redponde or else errors
        */
    })
    .catch((err)=>{                         //this should come after then (When I add this here works fine)
        return res.status(401).json({
            message: "Authentication Failed",
            error: err
        })
    })
})

// Signup 
router.post('/register',(req,res,next)=>{

    bcrypt.hash(req.body.password, 10).then((hash)=>{        // .hash(data, salt, cb) -> look into salt
        const user = new userSchema({                       //create a user for the DB entry
            name: req.body.name,
            email: req.body.email,
            password: hash          //password was hashed
        })

        user.save().then((response) => {            //mongoose method to save
            res.status(201).json({
                message: 'User created',
                result: response
            })
            .catch((error) => {
                res.status(500).json({
                    error
                })
            })
        })
        .catch((error) => {
            res.status(500).json({
                error
            })
        })
    })           
})

//dummy(get all the users) endpoints with authentication (only one route still)
router.route('/all-user').get(authorize, (req, res)=> {         // from .route can create chainable route handlers (like get post put altogether --> see docs)
    userSchema.find((error, response) => {          //finds documents
        if (error) {
            return next(error)
        }else{
            res.status(200).json(response)
        }

    })
})




module.exports = router