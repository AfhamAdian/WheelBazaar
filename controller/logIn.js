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

async function authUser ( username, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE (LOWER(REPLACE( NAME,' ', '')) = LOWER( REPLACE( :username, ' ', '' )) AND (PASSWORD = :password) )
        `
        const binds = { username, password };

        const result = await execute( sql, binds );

        if( result.length > 0 )
            return true;
        else 
            return false;
    }catch(err){
        console.log(err);
    }
}
 
async  function sendUserData ( username, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE (LOWER(REPLACE( NAME,' ', '')) = LOWER( REPLACE( :username, ' ', '' )) AND (PASSWORD = :password) )
        `
        const binds = { username, password };

        const result = await execute( sql, binds );

    }catch(err){
        console.log(err);
    }
}

module.exports = {
    authUser,
    sendUserData,
    sendUserDataByUserName
}