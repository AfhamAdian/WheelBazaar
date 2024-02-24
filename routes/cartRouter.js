const express = require('express');
const path = require('path');

const authorization = require('../middlewares/authorization.js');
const { sendUserData } = require('../controller/logIn.js');
const { getCartInfo,increment, decrement } = require('../controller/CART.JS');

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
        
        //res.status(200).json( { cartInfo } );
        res.render('cart',{authorized: "true",user_info:userDetails,cartProducts:cartInfo} );
    });
cartRouter
    .route('/increment')
    .post(async(req,res)=>{
        var cart_id = req.body.cart_id;
        var cnt = req.body.newCount;
        await increment(cart_id,cnt);
        res.json("ok");
    })
cartRouter
    .route('/decrement') 
    .post(async(req,res)=>{
        var cart_id = req.body.cart_id;
        var cnt = req.body.newCount;
        await decrement(cart_id,cnt);
        if(cnt == 0) {
            res.json({message : "render"})
        }
        else {
            res.json({message: "ok"})
        }
    })

cartRouter
    .route('/order')
    .post( authorization, async(req,res) => {

        const { email, password } = req.user;
        console.log( " /cart/order e ashlo \n");
        console.log("user: ", email , "  pasword: ", password );
        
        const userDetails = await sendUserData(email,password);
        console.log("userDetails: ", userDetails);
        const userID = userDetails[0].ID;

        const cartInfo = await getCartInfo(userID);
        console.log("cartInfo: ", cartInfo);
        
        const { order_state, payment_method, payment_status, voucher_no, showroom_id, paid_amount } = req.body;
        console.log("order_state: ", order_state, " payment_method: ", payment_method, " payment_status: ", payment_status, " voucher_no: ", voucher_no, " showroom_id: ", showroom_id, " paid_amount: ", paid_amount);
        
        const result = await orderFromCart( order_state, payment_method, payment_status, voucher_no, showroom_id, paid_amount );
        
        res.status(200).json(
            {
                status : "success"
            }
        );
    });

module.exports = cartRouter;