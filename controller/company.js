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
        const ct_sql="SELECT TYPE_ID,TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
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

async function getAllCars(id) {
    try {
        const sql = `
            SELECT * FROM
            CARS C 
            JOIN CARTYPE CT ON (C.TYPE_ID = CT.TYPE_ID)
            WHERE C.COMPANY_ID = :id
        `
        const binds = {id:id}
        const result = await execute(sql,binds)
        return result;
    } catch(error) {
        console.log(error)
    }
}

async function is_valid_new_car(company_id,model_name,color) {
    try {
        const sql = `
            SELECT check_add_new_car(:company_id,:model_name,:color) CK
            FROM DUAL
        `
        const binds = {company_id:company_id,model_name:model_name,color:color}
        const result = await execute(sql,binds)
        if(result[0].CK == 0) {
            return 0;
        }
        return 1;
    } catch(error) {
        console.log(error)
    }
}

async function add_new_car(model_name,color,car_type,seat_cap,engine_cap,price,stock,warranty,launch_date,car_image_url,id) {
    try {
        const sql = `
            BEGIN
                add_car(:model_name,:seat_cap,:engine_cap,:color,:price,:launch_date,:stock,:warranty,:id,:car_image_url,:car_type,-1);
            END;
        `

        const binds = {
            model_name:model_name,
            seat_cap:seat_cap,
            engine_cap:engine_cap,
            color:color,
            price:price,
            launch_date:launch_date,
            stock:stock,
            warranty:warranty,
            id:id,
            car_image_url:car_image_url,
            car_type:car_type
        }

        await execute(sql,binds)
        return ;
    } catch ( error) {
        console.log(error)
    }
}

module.exports = { updateStateWithId , getShowrooms ,getCarTypes , filterShowrooms ,getOrderlistByCompanyId , getAllCars , is_valid_new_car , add_new_car };