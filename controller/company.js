const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');

async function updateStateWithId ( state, id )
{
    try{

        if ( state != 'SHIPPING' && state != 'DELIVERED' && state != 'PROCESSING' ){
            throw new Error('Invalid State');
        }
        const sql =`
            BEGIN
                update_order_state ( :id, :state );
            END;
        `
        const binds = { id, state };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

async function getShowrooms() {
    try {
                const sql = `
                SELECT * 
                FROM SHOWROOM S
                JOIN LOCATIONS L ON (S.LOCATION_ID = L.LOCATION_ID)
            `
            const result = await execute(sql,{});
            return result;

    } catch(error) {
        console.log(error)
    }
}

async function getCarTypes() {
    try {
        const ct_sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
        car_types = await execute(ct_sql,{})
        return car_types;
    } catch(error) {
        console.log(error)
    }
}

async function filterShowrooms(division,city) {
    try {
        if(city == "Select City") {
            const sql = `
                    SELECT * FROM 
                    SHOWROOM S 
                    JOIN LOCATIONS L ON (S.LOCATION_ID = L.LOCATION_ID)
                    WHERE L.DIVISION LIKE :division
            `
            const binds = {division:division}
            const result = await execute(sql,binds);
            return result;
        } else {
            const sql = `
                SELECT * FROM 
                SHOWROOM S 
                JOIN LOCATIONS L ON (S.LOCATION_ID = L.LOCATION_ID)
                WHERE L.DIVISION LIKE :division AND L.CITY LIKE :city
            `
            const binds = {division:division,city:city};
            const result = await execute(sql,binds)
            return result;
        }
    } catch(error) {
        console.log(error)
    }
}

async function getOrderlistByCompanyId(id) {
    try {
        const sql = `
            SELECT * FROM
            ORDERLIST O 
            JOIN CART CT ON (O.CART_ID = CT.CART_ID)
            JOIN CARS C ON (CT.MODEL_COLOR_ID = C.MODEL_COLOR_ID)
            JOIN USERS U ON (U.ID = CT.CUSTOMER_ID)
            JOIN SHOWROOM S ON (S.SHOWROOM_ID = O.SHOWROOM_ID)
            WHERE C.COMPANY_ID = :id
        `
        const binds = {id:id}
        const result = await execute(sql,binds);
        return result;
    } catch(error) {
        console.log(error)
    }
}

module.exports = { updateStateWithId , getShowrooms ,getCarTypes , filterShowrooms ,getOrderlistByCompanyId };