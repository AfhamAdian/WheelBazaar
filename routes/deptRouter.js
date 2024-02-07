const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');



const routeDirectory = __dirname;
//console.log('Route Directory:', routeDirectory);

const viewDirectory = path.join(routeDirectory, '..', 'views');
//console.log('Absolute Path to View Directory:', viewDirectory);

const filePathInView = path.join(viewDirectory, 'dept.html');
//console.log('Absolute Path to File in View Directory:', filePathInView);


const departmentRouter = express.Router();
departmentRouter
    .route('/')
    .get(getDept)
    .post(postDept)


function getDept(req,res){
    res.sendFile( filePathInView );
    execute( "SELECT * FROM DEPARTMENTS" , {} );
}

function postDept(req,res){
    console.log("PostDept is working");
}

module.exports = departmentRouter;

