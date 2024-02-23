const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');


async function getCartInfo( user_id ) 
{
    try{
        const sql =`
        SELECT *
        FROM CART cart
        JOIN CARS cars ON ( cart.MODEL_COLOR_ID = cars.MODEL_COLOR_ID )
        JOIN USERS com ON (cars.COMPANY_ID = com.ID)
        JOIN CARTYPE ct ON (cars.TYPE_ID = ct.TYPE_ID)
		WHERE cart.CUSTOMER_ID = :user_id
        `;
        const binds = { user_id };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

async function increment(cart_id,cnt) {
    try{
        const sql =`
        UPDATE CART
        SET CAR_COUNT = :cnt
        WHERE CART_ID = :cart_id
        `;
        const binds = { cnt,cart_id };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

async function decrement(cart_id,cnt) {
    try{
        const sql =`
        BEGIN
            decrementCart(:cart_id,:cnt);
        END;
        `;
        const binds = { cart_id,cnt };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}


async function orderFromCart(  order_state, payment_method, payment_status, voucher_no, showroom_id  )
{
    try{
        const sql =`
        BEGIN 
            orderFromCart(:order_state, :payment_method, :payment_status, :voucher_no, :showroom_id);
        END;
        `;
        const binds = { model_color_id, user_id, status };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}


module.exports = { getCartInfo,increment,decrement };