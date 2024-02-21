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
        WHERE cart.CUSTOMER_ID = :user_id
        `;
        const binds = { user_id };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}


module.exports = { getCartInfo };