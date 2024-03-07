const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');

async function addCar( name, seat , engine, car_color, car_price ,l_date, car_stock, car_warranty, comp_id , url, typ_id , v_id )
{
    try{

        const sql =`
                BEGIN 
                add_car( :name, :seat, :engine, :car_color, :car_price, :l_date, :car_stock, :car_warranty, :comp_id, :url, :typ_id, :v_id);
                END;
            `
            const binds = {
                name: name,
                seat: seat,
                engine: engine,
                car_color: car_color,
                car_price: car_price,
                l_date: l_date,
                car_stock: car_stock,
                car_warranty: car_warranty,
                comp_id: comp_id,
                url: url,
                typ_id: typ_id,
                v_id: v_id
            }
            await execute(sql,binds);

    }catch(err){
        console.log(err);
    }
}


module.exports = { addCar };