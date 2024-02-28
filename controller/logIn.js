const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');


async function sendUserDataByUserName ( username )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE (LOWER(REPLACE( NAME,' ', '')) = LOWER( REPLACE( :username, ' ', '' )) )
        `
        const binds = { username };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

async function sendUserDataByID ( user_id )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE ID = :user_id
        `
        const binds = { user_id };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}


async function authUser ( email, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE (EMAIL = :email) AND (PASSWORD = :password) AND USER_TYPE LIKE 'CU'
        `
        const binds = { email, password };

        const result = await execute( sql, binds );

        if( result.length > 0 )
            return true;
        else 
            return false;
    }catch(err){
        console.log(err);
    }
}
 
async function sendUserData ( email, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS U JOIN CUSTOMER C ON (U.ID = C.ID)
            WHERE U.EMAIL = :email AND (U.PASSWORD = :password)
        `
        const binds = { email, password };

        const result = await execute( sql, binds );
        return result;

    }catch(err){
        console.log(err);
    }
}

async  function sendCustomerData ( email, password )
{
    try{
        const sql =`
            SELECT U.ID,U.NAME,U.EMAIL,U.PHONE_NUMBER,NVL(C.LOCATION_ID,0) AS LOCATION_ID
            FROM USERS U
            JOIN CUSTOMER C ON (U.ID = C.ID)
            WHERE U.EMAIL = :email AND (U.PASSWORD = :password)
        `
        const binds = { email, password };

        const result = await execute( sql, binds );
        return result;

    }catch(err){
        console.log(err);
    }
}

module.exports = {
    authUser,
    sendUserData,
    sendUserDataByUserName,
    sendUserDataByID,
    sendCustomerData
}