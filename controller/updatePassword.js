const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');
const { sendUserDataByUserName } = require('./logIn.js');

// update password function will update match the username with server user 
// and if match then update the password

async function updatePassword ( username, password )
{
    try{

        const sql =`
            UPDATE USERS
            SET PASSWORD = :password
            WHERE (LOWER(REPLACE( NAME,' ', '')) = LOWER( REPLACE( :username, ' ', '' )) )
        `
        const binds = { username, password };
        const result = await execute( sql, binds );

        //res.josn('Password Updated');
        return true;
    }catch(err){
        console.log(err);
    }

}
 

module.exports = {
    updatePassword
}