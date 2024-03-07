const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');

async function addVoucherForCarsFromCompany( name, discount, validity, company_id, car_id_arr )
{
    try{
        
        for( let i = 0; i < car_id_arr.length; i++ )
        {
            const sql =`
                BEGIN 
                    add_voucher( :name, :discount, :validity, 'CO', :car_id );
                END;
            `
            const binds = {
                name: name,
                discount: discount,
                validity: validity,
                car_id: car_id_arr[i]
            }
            await execute(sql,binds);
        }
    }catch(err){
        console.log(err);
    }
}




module.exports = { addVoucherForCarsFromCompany };