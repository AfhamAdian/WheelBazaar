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
            JOIN VOUCHER V ON (V.VOUCHER_NO = NVL(cars.VOUCHER_NO,0))
            WHERE cart.CUSTOMER_ID = :user_id AND cart.CONFIRM_STATUS = 'NOT_CONFIRMED'
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


async function orderFromCart( user_id,  order_state, payment_method, payment_status, voucher_no, showroom_id, paid_amount  )
{
    try{
        const sql =`
        BEGIN 
            orderFromCartOfUser(:user_id,:order_state, :payment_method, :payment_status, :voucher_no, :showroom_id, :paid_amount);
        END;
        `;
        const binds = { user_id,order_state, payment_method, payment_status, voucher_no, showroom_id, paid_amount };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

async function getShowRooms(l_id) {
    try {
        const sql = `
        SELECT * FROM SHOWROOM
        WHERE LOCATION_ID = :l_id
    `
    const binds = {l_id:l_id};
    const result = await execute(sql,binds);
    return result;
    } catch(error) {
        console.log(error);
    }
}

async function getorderlist(user_id) {
    try{
        const sql = `
            SELECT * FROM
            ORDERLIST O
            JOIN CART CT ON (O.CART_ID = CT.CART_ID)
            JOIN CARS C ON (CT.MODEL_COLOR_ID = C.MODEL_COLOR_ID)
            JOIN USERS U ON (U.ID = C.COMPANY_ID)
            JOIN CARTYPE CR ON (C.TYPE_ID = CR.TYPE_ID)
            JOIN SHOWROOM S ON (O.SHOWROOM_ID = S.SHOWROOM_ID)
            WHERE CT.CUSTOMER_ID = :user_id
        `
        const binds = {user_id:user_id};
        const result = await execute(sql,binds);
        return result;
    }
    catch(error) {
        console.log(error);
    }
}

async function payDueAmount(amount,orderId) {
    try {
        const sql = `
            BEGIN
                pay_due_amount(:amount,:orderId);
            END;
        `
        const binds = {
            amount : amount,
            orderId : orderId
        }

        await execute(sql,binds);

    } catch(error) {
        console.log(error);
    }

}


module.exports = { getCartInfo, increment, decrement, orderFromCart , getShowRooms ,getorderlist,payDueAmount};