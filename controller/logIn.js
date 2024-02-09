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
 
async  function sendUserData ( email, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE EMAIL = :email AND (PASSWORD = :password)
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
    sendUserDataByUserName
}