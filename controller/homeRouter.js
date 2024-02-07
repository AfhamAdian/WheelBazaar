const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');


async function updateUser () 
{
    try{
        
        console.log( 'company name in api  ' + companyName );
        const sql = `
            SELECT 
            C.MODEL_COLOR_ID,
            C.MODEL_NAME,
            C.SEAT_CAP,
            C.ENGINE_CAP,
            C.COLOR,
            C.PRICE,
            C.LAUNCH_DATE,
            C.STOCK,
            C.WARRANTY,
            C.CAR_IMAGE_URL,
            C.TYPE_ID,
            C.VOUCHER_NO
            FROM CARS C 
            JOIN COMPANY CP ON ( C.COMPANY_ID = CP.ID )
            JOIN USERS U ON ( U.ID = CP.ID )
            WHERE LOWER(REPLACE(U.NAME,' ','')) = LOWER( REPLACE(:companyName, ' ','' ) )
        `;

        const binds = { companyName }
        const result = await execute( sql , binds );
        return result;

    }catch(err){
        console.log(err);
    }
}

async function searchByType ( typeName ) 
{
    try{
        
        //console.log( 'company name in api  ' + companyName );
        const sql = `
        SELECT *
        FROM CARS 
        WHERE TYPE_ID = 
        (
            SELECT TYPE_ID
            FROM CARTYPE
            WHERE LOWER(REPLACE(TYPE_NAME,' ','')) = LOWER(REPLACE( :typeName ,' ','' ))
        )
        `;

        const binds = { typeName }
        const result = await execute( sql , binds );
        return result;

    }catch(err){
        console.log(err);
    }
}

async function searchByName(carName)
{
    try{
        const sql = `
        SELECT *
        FROM CARS
        WHERE LOWER(REPLACE(MODEL_NAME, ' ', '' )) = LOWER(REPLACE( 'Corolla Cross', ' ', '' ))
        `;

        const binds = { carName }
        const result = await execute( sql , binds );
        return result;

    }catch(err){
        console.log(err);
    }
}

function test ()
{
    console.log("test ashe");
}


module.exports = { searchByCompany, searchByType , searchByName, test };