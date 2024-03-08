const express = require('express');
const { execute } = require('../../DB/dbConnect.js');
const path = require('path');


async function monthlySalesGraphGenerator ( comp_id )
{
    try{
        
        const sql = `
            SELECT COUNT(*) as countCar , EXTRACT(DAY FROM O1.ORDER_DATE) as orderDate
            FROM ORDERLIST O1
            JOIN CART CA1 USING (CART_ID)
            JOIN CARS C1 USING ( MODEL_COLOR_ID )
            WHERE C1.COMPANY_ID = :comp_id AND (O1.ORDER_DATE BETWEEN TRUNC(SYSDATE, 'MM') AND  ADD_MONTHS(TRUNC(SYSDATE, 'MM'),1))
            GROUP BY  EXTRACT(DAY FROM O1.ORDER_DATE)
            ORDER BY EXTRACT(DAY FROM O1.ORDER_DATE)
        `;
        const binds = { comp_id }
        const result = await execute( sql , binds );

        console.log( 'monthly sales graph generator' );
        console.log( result );
        console.log( 'monthly sales graph generator enddddd' );
        return result;

    }catch(err){
        console.log(err);
    }
}


async function monthlySalesPieGenerator ( comp_id )
{
    try{
        
        const sql = `
            SELECT C1.TYPE_ID as TYPE ,COUNT(*) as COUNTCAR
            FROM ORDERLIST O1
            JOIN CART CA1 USING (CART_ID)
            JOIN CARS C1 USING ( MODEL_COLOR_ID )
            WHERE C1.COMPANY_ID = :comp_id AND (O1.ORDER_DATE BETWEEN TRUNC(SYSDATE, 'MM') AND ADD_MONTHS(TRUNC(SYSDATE, 'MM'),1))
            GROUP BY C1.TYPE_ID
        `;
        const binds = { comp_id }
        const result = await execute( sql , binds );

        console.log( 'monthly sales PIE generator' );
        console.log( result );
        console.log( 'monthly sales PIE generator END' );
        return result;

    }catch(err){
        console.log(err);
    }
}


async function salesInMonth ( comp_id )
{
    try{
        
        const sql = `
            SELECT sales_in_month( :comp_id ) CSC
            FROM DUAL
        `;
        const binds = { comp_id }
        const result = await execute( sql , binds );

        console.log( result[0].CSC );

        return result[0].CSC;

    }catch(err){
        console.log(err);
    }
}

async function salesInYear ( comp_id )
{
    try{
        
        const sql = `
            SELECT sales_in_year( :comp_id ) CSC
            FROM DUAL
        `;
        const binds = { comp_id }
        const result = await execute( sql , binds );

        console.log( result[0].CSC );

        return result[0].CSC;

    }catch(err){
        console.log(err);
    }
}



module.exports = { monthlySalesGraphGenerator, monthlySalesPieGenerator, salesInMonth, salesInYear };