const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const authorization = require('../middlewares/authorization.js');

const logOutRouter = express.Router();

logOutRouter
    .route('/')

    .get( authorization, async(req,res) =>
    {  
        res.clearCookie('token');
        res.clearCookie('isLoggedIn');
        res.redirect('/'); 
    });


module.exports = logOutRouter;//