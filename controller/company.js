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
        const binds = { state, id };

        const result = await execute( sql, binds );

        return result;
    }catch(err){
        console.log(err);
    }
}

module.exports = { updateStateWithId };