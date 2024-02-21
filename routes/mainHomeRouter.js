const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');
const { result } = require('lodash');
const { searchByCompany, searchByType, searchByName, test } = require('../controller/mainHome.js');
const { addToCart } = require('../controller/mainHome.js');
const { type } = require('os');
const authorization = require('../middlewares/authorization.js');
const decodeTokenFromCookies = require('../utils/decodeToken.js');


const {sendUserData, sendUserDataByID } = require('../controller/logIn.js');
const { Console } = require('console');
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
let company_names;
let car_types;

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
            car_types=await execute(sql,{});
            //console.log(car_types);
            company_names=await execute(sql2,{});
            //console.log(company_names);
            res.render('index',{car_types: car_types,company_names: company_names,authorized: "false",user:"user",user_info:[{ID: 0}]});
        }
        else
        {
            console.log("user is logged in");
            const token = req.cookies.token;
            const user = decodeTokenFromCookies(token);
            console.log("user: ", user);
            
            const sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
            const sql2="SELECT NAME FROM USERS WHERE USER_TYPE = 'CO'";
            car_types=await execute(sql,{});
            //console.log(car_types);
            company_names=await execute(sql2,{});
            const email = user.email;
            const password = user.password;
            const user_info = await sendUserData(email,password);
            //console.log(company_names);
            res.render('index',{car_types: car_types,company_names: company_names,authorized: "true" , user: user,user_info:user_info});
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
    mainHomeRouter
        .route('/addtocart')
        .post(async(req,res)=> {
            const {
                model_color_id,
                user_id
            } = req.body;
            console.log(model_color_id)
            console.log(user_id)
            
            const status = "NOT_CONFIRMED";                             // not confirmed status when addin to cart
                                                                        // willbe confirmed when the user confirms the order
            const ans = addToCart( model_color_id, user_id, status );
            res.json({message: "ok"})
        })
    mainHomeRouter
        .route('/cardetails')
        .get(async(req,res)=>{
            var car_id = req.query.car_id;
            var user_id = req.query.user_id;
            const sql = `
            SELECT * FROM CARS C
            JOIN COMPANY CO ON C.COMPANY_ID = CO.ID
            JOIN CARTYPE CA ON C.TYPE_ID = CA.TYPE_ID
            JOIN USERS U ON C.COMPANY_ID = U.ID
            WHERE C.MODEL_COLOR_ID = :car_id`
            const binds = {car_id};
            const product = await execute(sql,binds);
            var authorized;
            if(user_id == 0) {
                authorized = "false";
                res.render('car_details',{authorized:authorized,user_info:[{ID: 0}],product:product})
            }
            else {
                authorized = "true";
                const user_info = await sendUserDataByID(user_id);
                res.render('car_details',{authorized:authorized,user_info:user_info,product:product})
            }
        })

    module.exports = mainHomeRouter;