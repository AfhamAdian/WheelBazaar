const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');
const { result } = require('lodash');
const { searchByCompany, searchByType, searchByName, test } = require('../controller/mainHome.js');
const { type } = require('os');
const authorization = require('../middlewares/authorization.js');
const decodeTokenFromCookies = require('../utils/decodeToken.js');



// Assuming __dirname is the 'route' directory
const routeDirectory = __dirname;
//console.log('Route Directory:', routeDirectory);

// Construct the absolute path to the 'view' directory
const viewDirectory = path.join(routeDirectory, '..', 'views');
//console.log('Absolute Path to View Directory:', viewDirectory);

// Construct the absolute path to the desired file in the 'view' directory
const filePathInView = path.join(viewDirectory, 'page1.html');
//console.log('Absolute Path to File in View Directory:', filePathInView);


const mainHomeRouter = express.Router();

mainHomeRouter
    .route('/')
    .get( async (req,res) => 
    {   
        const isLoggedIn = req.cookies.isLoggedIn;          // flag to check if anyone is logged in or not

        console.log("login status " + isLoggedIn);

        if( isLoggedIn == 'false' || isLoggedIn == undefined )
        {
            const sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
            const sql2="SELECT NAME FROM USERS WHERE USER_TYPE = 'CO'";
            const car_types=await execute(sql,{});
            //console.log(car_types);
            const company_names=await execute(sql2,{});
            //console.log(company_names);
            res.render('index',{car_types: car_types,company_names: company_names,authorized: "false",user:"user"});
        }
        else
        {
            console.log("user is logged in");
            const token = req.cookies.token;
            const user = decodeTokenFromCookies(token);
            console.log("user: ", user);
            
            const sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
            const sql2="SELECT NAME FROM USERS WHERE USER_TYPE = 'CO'";
            const car_types=await execute(sql,{});
            //console.log(car_types);
            const company_names=await execute(sql2,{});
            //console.log(company_names);
            res.render('index',{car_types: car_types,company_names: company_names,authorized: "true" , user: user});
        }

    })
    .post( async (req, res) => {
        res.write("Post is sent");
    })
    
mainHomeRouter
    .route('/showBrandWise')
    .get( async ( req, res ) => {
        // console.log("asche");
        // const companyName = req.body.buttonText;

        // console.log(companyName);
        // test();
        // const result = await searchByCompany( companyName );
        // res.json(result);
    })
    .post( async ( req, res ) => {
        console.log("asche");
        const companyName = req.body.buttonText;

        console.log(companyName);
        test();
        const result = await searchByCompany( companyName );
        res.json(result);
    })

mainHomeRouter
    .route('/showTypeWise')
    .get( async ( req, res ) => {
        // console.log("asche");
        // const {
        //     typeName
        // } = req.params;

        // console.log(typeName);

        // const result = await searchByType( typeName );
        // console.log( result );

        // const sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
        // const sql2="SELECT NAME FROM USERS WHERE USER_TYPE = 'CO'";
        // const car_types=await execute(sql,{});
        // const company_names=await execute(sql2,{});
        // res.render('index',{car_types: car_types,company_names: company_names,result: result});
    })
    .post( async ( req, res ) => {
        //console.log("asche");
        console.log("asche");
        const typename = req.body.buttonText;

        console.log(typename);
        test();
        const result = await searchByType( typename );
        res.json(result);
    })

    mainHomeRouter
        .route('/searchByCarName')
        .post( async ( req, res ) => 
        {
            console.log( 'post e dhukse ');
            const carName= req.body.name;
            const result = await searchByName(carName);
            res.json(result);
        })


    module.exports = mainHomeRouter;//