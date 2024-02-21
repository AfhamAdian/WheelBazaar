const express = require('express');
const path = require('path');

const authorization = require('../middlewares/authorization.js');
const { sendUserData } = require('../controller/logIn.js');
const { getCartInfo } = require('../controller/CART.JS');

const cartRouter = express.Router();

cartRouter
    .route('/')

    .get( authorization, async(req,res) =>
    {  
        const { email, password } = req.user;
        console.log( " /cart e ashlo \n");
        console.log("user: ", email , "  pasword: ", password );
        
        const userDetails = await sendUserData(email,password);
        console.log("userDetails: ", userDetails);
        const userID = userDetails[0].ID;

        const cartInfo = await getCartInfo(userID);
        console.log("cartInfo: ", cartInfo);
        
        res.status(200).json( { cartInfo } );
        //res.render('cart',{ email, password } );
    });


module.exports = cartRouter;//