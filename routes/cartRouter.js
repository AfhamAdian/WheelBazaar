const express = require('express');
const path = require('path');

const { authorization } = require('../middlewares/authorization.js');
const { sendUserData } = require('../controller/logIn.js');
const { getCartInfo,increment, decrement , getShowRooms ,orderFromCart,getorderlist,payDueAmount} = require('../controller/CART.JS');

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
        res.render('cart',{authorized: "true",user_info:userDetails,cartProducts:cartInfo} );
    });
cartRouter
    .route('/increment')
    .post(async(req,res)=>{
        var cart_id = req.body.cart_id;
        var cnt = req.body.newCount;
        await increment(cart_id,cnt);
        res.json("ok");
    });
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
    });

cartRouter
    .route('/order')
    .post( authorization, async(req,res) => {
        const { email, password } = req.user;
        console.log("user: ", email , "  pasword: ", password );
        const userDetails = await sendUserData(email,password);
        console.log("userDetails: ", userDetails);
        const userID = userDetails[0].ID;
        const cartInfo = await getCartInfo(userID);     
        const { order_state, payment_method, payment_status, voucher_no, showroom_id, paid_amount } = req.body;
        console.log("order_state: ", order_state, " payment_method: ", payment_method, " payment_status: ", payment_status, " voucher_no: ", voucher_no, " showroom_id: ", showroom_id, " paid_amount: ", paid_amount);
        
        const result = await orderFromCart( userID,order_state, payment_method, payment_status, voucher_no, showroom_id, paid_amount );
        
        res.json(
            {
                status : "success"
            }
        );
    })
cartRouter
    .route('/checkout')
    .get(authorization,async(req,res)=>{
        const { email, password } = req.user;
        console.log( " /cart e ashlo \n");
        console.log("user: ", email , "  pasword: ", password );
        
        const userDetails = await sendUserData(email,password);
        console.log("userDetails: ", userDetails);
        const userID = userDetails[0].ID;
        const l_id = userDetails[0].LOCATION_ID;
        const showroom = await getShowRooms(l_id);
        const cartInfo = await getCartInfo(userID);
        var total_price = 0;
        for(var i=0 ; i<cartInfo.length;i++) {
            total_price = total_price + (cartInfo[i].PRICE * cartInfo[i].CAR_COUNT);
        }
        res.render('checkout',{authorized: "true",user_info:userDetails,cartProducts:cartInfo,showroom:showroom,total_price:total_price} );
    });
cartRouter
    .route('/myorders')
    .get(authorization,async(req,res)=>{
        const { email, password } = req.user;
        const userDetails = await sendUserData(email,password);
        console.log("userDetails: ", userDetails);
        const userID = userDetails[0].ID;
        const orderlist = await getorderlist(userID);
        res.render('customerorderlist',{authorized: "true",user_info:userDetails,orderlist:orderlist});
    })
cartRouter
    .route('/paydueamount')
    .post(async(req,res)=>{
        const {
            amount,
            orderId
        } = req.body;
        await payDueAmount(amount,orderId);
        res.json({message: "ok"})
    })

module.exports = cartRouter;