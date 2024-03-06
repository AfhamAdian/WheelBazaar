const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');

async function sendUserIdFromEmailPass ( email, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE (EMAIL = :email) AND (PASSWORD = :password)
        `
        const binds = { email, password };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

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

async function sendUserDataByIdGeneral ( user_id )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE ID = :user_id
        `
        const binds = { user_id };

        const result = await execute( sql, binds );

        let sql2 = {};

        if( result[0].USER_TYPE == 'CU' ){
            sql2 = `
                SELECT *
                FROM USERS JOIN CUSTOMER USING (ID)
                WHERE ID = :user_id
            `
        }
        else if( result[0].USER_TYPE == 'CO' ){
            sql2 = `
                SELECT *
                FROM USERS JOIN COMPANY USING (ID)
                WHERE ID = :user_id
            `
        }
        else if ( result[0].USER_TYPE == 'AD' ){
            sql2 = `
                SELECT *
                FROM USERS JOIN ADMIN USING (ID)
                WHERE ID = :user_id
            `
        }
        else {
            return undefined;           // if no such user id found
        }
        
        const binds2 = { user_id };
        result2 = await execute( sql2, binds2 );

        return result2;
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

async function authCompany ( email, password )
{
    try{
        const sql =`
            SELECT *
            FROM USERS
            WHERE (EMAIL = :email) AND (PASSWORD = :password) AND USER_TYPE LIKE 'CO'
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
        const sql = `
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
    sendUserDataByIdGeneral,
    sendUserIdFromEmailPass,
    authUser,
    sendUserData,
    sendUserDataByUserName,
    sendUserDataByID,
    sendCustomerData,
    authCompany
}