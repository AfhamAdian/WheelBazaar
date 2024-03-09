const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const { authorization, authorizationCompany } = require('../../middlewares/authorization.js');

const logOutRouter = express.Router();

logOutRouter
    .route('/')

    .get( authorization, async(req,res) =>
    {  
        res.clearCookie('token');
        res.clearCookie('isLoggedIn');
        res.redirect('/'); 
    });

logOutRouter    
    .route('/company')
    .get( authorizationCompany, async(req,res) =>
    {  
        res.clearCookie('tokenCompany');
        res.clearCookie('isLoggedInCompany');
        res.redirect('/login/company'); 
    });

module.exports = logOutRouter;