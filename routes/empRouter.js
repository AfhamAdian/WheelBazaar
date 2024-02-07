const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');



const routeDirectory = __dirname;

// Construct the absolute path to the 'view' directory
const viewDirectory = path.join(routeDirectory, '..', 'views');

// Construct the absolute path to the desired file in the 'view' directory
const filePathInView = path.join(viewDirectory, 'emp.html');


const departmentRouter = express.Router();
departmentRouter
    .route('/')
    .get(getEmp)
    .post(postEmp)


function getEmp(req,res){
    res.sendFile( filePathInView );
    execute( "SELECT * FROM EMPLOYEES" , {} );
}

function postEmp(req,res){
    console.log("PostDept is working");
}

module.exports = departmentRouter;

