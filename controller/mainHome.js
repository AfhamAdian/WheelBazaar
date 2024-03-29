const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');
const { use } = require('../routes/customer/logInRouter.js');


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
            JOIN VOUCHER V ON (NVL(C.VOUCHER_NO,0) = V.VOUCHER_NO)
            WHERE LOWER(REPLACE(U.NAME,' ','')) = LOWER( REPLACE(:companyName, ' ','' ) )
        `;

        const binds = { companyName }
        const result = await execute( sql , binds );
        console.log(result)
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
        JOIN VOUCHER V ON (NVL(C.VOUCHER_NO,0) = V.VOUCHER_NO)
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
        JOIN VOUCHER V ON (NVL(C.VOUCHER_NO,0) = V.VOUCHER_NO)
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
        const sqlll = `
            SELECT COUNT(*) CNT
            FROM CART
            WHERE MODEL_COLOR_ID = :model_color_id AND CUSTOMER_ID = :user_id AND CONFIRM_STATUS LIKE 'NOT_CONFIRMED'
        `
        const bindsss = {model_color_id:model_color_id,user_id:user_id}
        const cnt = await execute(sqlll,bindsss)
        if(cnt[0].CNT == 0) {
            const sql =`
            BEGIN
                DBMS_OUTPUT.PUT_LINE ( addToCart(:model_color_id,:user_id,:status) );
            END;
            `;
    
            const binds = { model_color_id, user_id, status };
            const result = await execute( sql, binds );
            return result;
        } else {
            return 0;
        }
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

async function addComment ( model_color_id, user_id, comment_text )
{
    try{
        const sql =`
        BEGIN 
            ADD_COMMENT( :model_color_id, :user_id , :comment_text );
        END;
        `;

        const binds = { model_color_id, user_id, comment_text };
        const result = await execute( sql, binds );
        return result;
    }catch(err){
        console.log(err);
    }

}

async function editComment(comment_id, comment_text) {
    try {
        const sql = `
        BEGIN
            edit_comment(:comment_id,:comment_text);
        END;
        `
        const binds = {comment_id:comment_id, comment_text:comment_text};
        const result = await execute( sql, binds );
        return result;
    }catch(err){
        console.log(err);
    }
}

async function get_user_rating(car_id,user_id) {
    try {
        const sql = `
            SELECT NVL(RATING,0) RATE
            FROM RATING 
            WHERE MODEL_COLOR_ID = :car_id AND CUSTOMER_ID = :user_id
        `
        const binds = {car_id : car_id,user_id:user_id}
        const result = await execute(sql,binds);
        return result
    } catch(error) {
        console.log(error)
    }
}

async function get_user_comment(car_id,user_id) {
    try {
        const sql = `
            SELECT * FROM
            COMMENTS
            WHERE MODEL_COLOR_ID = :car_id AND CUSTOMER_ID = :user_id
        `
        const binds = {car_id : car_id,user_id:user_id}
        const result = await execute(sql,binds);
        return result
    } catch(error) {
        console.log(error)
    }
}

async function get_all_comment(car_id,user_id) {
    try {
        const sql = `
            SELECT * FROM COMMENTS C 
            JOIN USERS U ON (C.CUSTOMER_ID = U.ID)
            WHERE C.MODEL_COLOR_ID = :car_id
            MINUS
            (SELECT * FROM
            COMMENTS CC
            JOIN USERS UU ON (CC.CUSTOMER_ID = UU.ID)
            WHERE CC.MODEL_COLOR_ID = :car_id AND CC.CUSTOMER_ID = :user_id)
        `
        const binds = {car_id : car_id,user_id:user_id}
        const result = await execute(sql,binds);
        return result
    } catch(error) {
        console.log(error)
    }
}

async function get_average_rating(car_id) {
    try {
        const sql = `
            SELECT NVL(AVG(RATING),0) AVERAGE
            FROM RATING
            WHERE MODEL_COLOR_ID = :car_id
        `
        const binds = {car_id : car_id}
        const result = await execute(sql,binds);
        return result
    } catch(error) {
        console.log(error)
    }
}

async function is_eligible_to_review(car_id,user_id) {
    try {
        const sql = `
            SELECT * 
            FROM ORDERLIST O
            JOIN CART CT ON (O.CART_ID = CT.CART_ID)
            WHERE O.ORDER_STATE LIKE 'DELIVERED' AND CT.MODEL_COLOR_ID = :car_id AND CT.CUSTOMER_ID = :user_id
        `
        const binds = {car_id : car_id,user_id:user_id}
        const result = await execute(sql,binds);
        if(result.length > 0 ) {
            return 1;
        }
        else {
            return 0;
        }
    } catch(error) {
        console.log(error)
    }
}

async function is_rated_by_user(car_id,user_id) {
    try{
        const sql = `
            SELECT * FROM
            RATING 
            WHERE MODEL_COLOR_ID = :car_id AND CUSTOMER_ID = :user_id
        `
        const binds = {car_id: car_id,user_id:user_id}
        const result = await execute(sql,binds)
        if(result.length > 0) {
            return 1
        }
        else {
            return 0
        }
    } catch(error) {
        console.log(error)
    }
}

async function addRating(model_color_id,user_id,rating) {
    try{
        const sql = `
            BEGIN 
                addRating(:model_color_id,:user_id,:rating);
            END;
        `
        const binds = {model_color_id:model_color_id,user_id:user_id,rating:rating}
        await execute(sql,binds)
        return 0;
    } catch(error) {
        console.log(error)
    }
}

async function updateRating(model_color_id,user_id,rating) {
    try{
        const sql = `
            BEGIN 
                updateRating(:model_color_id,:user_id,:rating);
            END;
        `
        const binds = {model_color_id:model_color_id,user_id:user_id,rating:rating}
        await execute(sql,binds)
        return 0;
    } catch(error) {
        console.log(error)
    }
}

async function get_trending_cars() {
    try {
        const sql = `
        SELECT D1.MODEL_COLOR_ID, COUNT( DISTINCT D2.MODEL_COLOR_ID )+1 as RANK
        FROM ( 
            SELECT C1.MODEL_COLOR_ID, car_sales_count(C1.MODEL_COLOR_ID) as CARSALES
            FROM
            ORDERLIST O1
            JOIN CART CA1 ON (O1.CART_ID = CA1.CART_ID ) 
            JOIN CARS C1 ON ( C1.MODEL_COLOR_ID = CA1.MODEL_COLOR_ID ) 
            GROUP BY C1.MODEL_COLOR_ID
        ) D1
        LEFT OUTER JOIN 
        (	
            SELECT C1.MODEL_COLOR_ID, car_sales_count(C1.MODEL_COLOR_ID) as CARSALES
            FROM
            ORDERLIST O1
            JOIN CART CA1 ON (O1.CART_ID = CA1.CART_ID ) 
            JOIN CARS C1 ON ( C1.MODEL_COLOR_ID = CA1.MODEL_COLOR_ID ) 
            GROUP BY C1.MODEL_COLOR_ID
        ) D2
        ON ( D1.CARSALES < D2.CARSALES )
        GROUP BY D1.MODEL_COLOR_ID
        ORDER BY RANK
        `
        const result = await execute(sql,{})
        let trending = []

        for(var i=0 ; i< result.length && i<5 ;i++) {
            const sql2 = `
                SELECT * FROM 
                CARS C JOIN USERS U ON (C.COMPANY_ID = U.ID)
                JOIN CARTYPE CT ON (C.TYPE_ID = CT.TYPE_ID)
                WHERE MODEL_COLOR_ID = :id
            `
            const binds = {id:result[i].MODEL_COLOR_ID}
            const car = await execute(sql2,binds)
            trending.push(car[0])
        }

        return trending

    } catch(error) {
        console.log(error)
    }
}


module.exports = { searchByCompany, searchByType , searchByName, test, addToCart , sendLocationDataByLocationId ,updateCustomerData, addComment, editComment , get_user_rating , get_user_comment ,get_all_comment , get_average_rating ,is_eligible_to_review , is_rated_by_user , addRating , updateRating , get_trending_cars};