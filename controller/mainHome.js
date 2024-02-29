const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');


async function searchByCompany( companyName ) 
{
    try{
        
        console.log( 'company name in api  ' + companyName );
        const sql = `
            SELECT *
            FROM CARS C 
            JOIN COMPANY CP ON ( C.COMPANY_ID = CP.ID )
            JOIN USERS U ON ( U.ID = CP.ID )
            JOIN CARTYPE CT ON (C.TYPE_ID = CT.TYPE_ID)
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
        FROM CARS C
        JOIN USERS U ON (U.ID = C.COMPANY_ID)
        JOIN CARTYPE CT ON (C.TYPE_ID = CT.TYPE_ID)
        WHERE C.TYPE_ID = 
        (
            SELECT CCCC.TYPE_ID
            FROM CARTYPE CCCC
            WHERE LOWER(REPLACE(CCCC.TYPE_NAME,' ','')) = LOWER(REPLACE( :typeName ,' ','' ))
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
        const editedCarName = `'%`+ carName + `%'`;
        console.log( editedCarName );

        const sql = `
        SELECT *
        FROM CARS C
        JOIN USERS U ON (U.ID = C.COMPANY_ID)
        JOIN CARTYPE CT ON (C.TYPE_ID = CT.TYPE_ID)
        WHERE LOWER(REPLACE(MODEL_NAME, ' ', '' )) LIKE LOWER(REPLACE( ${editedCarName} , ' ', '' ))
        `;
        
        const binds = { }
        const result = await execute( sql , binds );
        return result;

    }catch(err){
        console.log(err);
    }
}

async function addToCart( model_color_id, user_id , status)
{
    try{
        
        const sql =`
        BEGIN
            DBMS_OUTPUT.PUT_LINE ( addToCart(:model_color_id,:user_id,:status) );
        END;
        `;

        const binds = { model_color_id, user_id, status };
        const result = await execute( sql, binds );
        return result;
    }catch(err){
        console.log("\nadd to cart failed\n" );
        console.log(err);
    }
}




function test ()
{
    console.log("test ashe");
}

async function sendLocationDataByLocationId(id) {
    try {
        const sql = `
        SELECT * 
        FROM LOCATIONS
        WHERE LOCATION_ID = :id
        `
        const binds = {id};
        const result = await execute(sql,binds);
        console.log(result)
        return result;
    }
    catch(error) {
        console.log(error)
    }
}

async function updateCustomerData(email,name,phone,division,city,id) {
    const sql = `
    SELECT check_update_criteria(:email,:phone,:id) CSC
    FROM DUAL
    `
    const binds = {email,phone,id}
    var res1 = await execute(sql,binds);
    console.log(res1)
    if(res1[0].CSC == 1) {
        return 1;
    }
    if(res1[0].CSC == 2) {
        return 2;
    }
    if(res1[0].CSC == 0) {
        const sql2 = `
        BEGIN
            updateCustomer(:name,:email,:phone,:city,:id);
        END;
        `
        const binds2 = {name,email,phone,city,id}
        var res2 = await execute(sql2,binds2);
        return 0;
    }
}


module.exports = { searchByCompany, searchByType , searchByName, test, addToCart , sendLocationDataByLocationId ,updateCustomerData };