const express = require('express');
const path = require('path');

const { authorization } = require('../../middlewares/authorization.js');
const { execute }  = require('../../DB/dbConnect.js');
const { finished } = require('stream');

const filterRouter = express.Router();


filterRouter
    .route('/')
    .get( async (req,res) =>
    {
        console.log('Filter Route');
        try{
            const query = req.query;
            console.log(query);

            const color = query.color;
            const warranty = query.warranty;
            const seatcap = query.seatcap;
            const enginecap = query.enginecap;
            const maxPrice = query.price;

            let colors = [];
            let warranties = [];
            let seatcaps = [];
            let enginecaps = [];
            let maxPrices = [];


            if( color != undefined ) {
                colors = color.split(',');
                console.log(colors);
            }
            if( warranty != undefined ) {
                warranties = warranty.split(',');
                console.log(warranties);
            }
            if( seatcap != undefined ) seatcaps = seatcap.split(',');
            if( enginecap != undefined ) enginecaps = enginecap.split(',');
            if( maxPrice != undefined ) maxPrices = maxPrice.split(',');
            
            
            let resultFinal = [];
            let result = [];
            let check = 0;

            //filtering color 
            for ( let i = 0; i < colors.length; i++ )
            {
                const sql = `
                    SELECT * FROM CARS
                    WHERE LOWER(COLOR) = LOWER(:color)
                `;
                const binds = { color: colors[i] };
                const result1 = await execute( sql, binds );
                //here i will take intersection on reslut and result1
                
                result = result.concat(result1);
            }
            if ( check == 0 && result.length > 0 && colors.length > 0 ) {
                resultFinal = result;
                check++;
            }
            else if ( colors.length > 0 ) resultFinal = resultFinal.filter(item1 => result.some(item2 => item2.MODEL_COLOR_ID === item1.MODEL_COLOR_ID));
            

            //filtering warranty
            result = [];
            for ( let i = 0; i < warranties.length; i++ )
            {
                const sql = `
                    SELECT * FROM CARS
                    WHERE WARRANTY = :warranty 
                `;
                const binds = { warranty: warranties[i] };
                const result1 = await execute( sql, binds );
                //here i will take intersection on reslut and result1
                result = result.concat(result1);
            }
            if ( check == 0 && result.length > 0 && warranties.length > 0 ) {
                resultFinal = result;
                check++;
            }
            else if ( warranties.length > 0 ) resultFinal = resultFinal.filter(item1 => result.some(item2 => item2.MODEL_COLOR_ID === item1.MODEL_COLOR_ID));


            //filtering seatcap 
            result = [];
            for ( let i = 0; i < seatcaps.length; i++ )
            {
                const sql = `
                    SELECT * FROM CARS
                    WHERE SEAT_CAP = :cap 
                `;
                const binds = { cap :   seatcaps[i] };
                const result1 = await execute( sql, binds );
                //here i will take intersection on reslut and result1
                result = result.concat(result1);
            }
            if ( check == 0 && result.length > 0 && seatcaps.length > 0 ) {
                resultFinal = result;
                check++;
            }
            else if ( seatcaps.length > 0 ) resultFinal = resultFinal.filter(item1 => result.some(item2 => item2.MODEL_COLOR_ID === item1.MODEL_COLOR_ID));


            res.status(200).json(resultFinal);
        }catch(err){
            console.log(err);
        }   
    })
    // .post ( async (req,res) =>
    // {
    //     try{
    //         const query = req.query;
    //         console.log(query);

    //         const color = query.color;
    //         const warranty = query.warranty;
    //         const seatcap = query.seatcap;
    //         const enginecap = query.enginecap;
    //         const maxPrice = query.price;

    //         let colors = [];
    //         let warranties = [];
    //         let seatcaps = [];
    //         let enginecaps = [];
    //         let maxPrices = [];


    //         if( color != undefined ) colors = color.split(',');
    //         if( warranty != undefined ) warranties = warranty.split(',');
    //         if( seatcap != undefined ) seatcaps = seatcap.split(',');
    //         if( enginecap != undefined ) enginecaps = enginecap.split(',');
    //         if( maxPrice != undefined ) maxPrices = maxPrice.split(',');
            
            
    //         let result = [];

    //         for ( let i = 0; i < colors.length; i++ )
    //         {
    //             const sql = `
    //                 SELECT * FROM CARS
    //                 WHERE COLOR = :color
    //             `;
    //             const binds = { color: colors[i] };
    //             const result1 = await execute( sql, binds );
    //             //here i will take intersection on reslut and result1
                
    //             if( result.length == 0 ) result = result1;
    //             else result = result.filter(item1 => result1.some(item2 => item2.MODEL_COLOR_ID === item1.MODEL_COLOR_ID));
    //         }

    //         console.log(result);
    //     }catch(err){
    //         console.log(err);
    //     }
    // });


    /// color, warranty, seatcap, engine cap, price

    module.exports = filterRouter;