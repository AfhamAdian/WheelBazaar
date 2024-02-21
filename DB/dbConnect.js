const express = require('express');
const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit=true;

//Connecting databse 

// DB pool creation function
const init = async ()=> {
    
    //oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

    //oracledb.autoCommit = true                        // CRUD operations will automatically change database permenantly
                //                                      // if flase, i have to use connection.commit() after every CRUD
            
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    try {
        await oracledb.createPool({
            user          : "WheelBazaar",
            password      : "abdadi",                   // mypw contains the hr schema password
            connectString : "localhost/orcl",
            poolIncrement : 1,
            poolMax       : 15,
            poolMin       : 4
        });
        console.log("Database pool created...");
    }catch(err){
        console.log(`Found error : ${err.message} while creating db pool...`);
    }

}
// Pool closing Function
const close = async () => {
    console.log('Closing db...');
    try{
        await oracledb.getPool().close(0);
        console.log('DB closed successfully...');
    }catch(err){
        console.log(`Found error : ${err.message + '\n'} while closing db...`);
    }
}

// SQL execution function
const execute = async ( sql, binds) => {
    //console.log( `Sql statemnt passed with ` + sql + ` binds ` + binds + `\n`);
    console.log( sql );
    
    let connection;
    try{
        connection = await oracledb.getConnection();
        resultQuery = await connection.execute( sql, binds );

        // console.log(resultQuery.rows);
        console.log("SQL query Result returned Successfully" + '\n');

        return resultQuery.rows;                                // returns data trom DATABASE table

    }catch( err ){
        console.log(`Found error : ${err.message} while excecuting SQL QUERY`);
    }finally{
        if (connection) {
            try {
                await connection.close();           // Put the connection back in the pool
            } catch (err) {
                console.log(`Found error : ${err.message} while closing Connection after SQL Query`);
            }
        }
    }
}



module.exports = { init, close, execute };