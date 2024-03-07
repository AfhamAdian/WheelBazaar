const express = require('express');
const { execute } = require('../../DB/dbConnect.js');
const path = require('path');
const { result } = require('lodash');
const { searchByCompany, searchByType, searchByName, test , sendLocationDataByLocationId, addComment, editComment , updateCustomerData } = require('../../controller/mainHome.js');
const { addToCart } = require('../../controller/mainHome.js');
const { type } = require('os');
const { authorization } = require('../../middlewares/authorization.js');
const decodeTokenFromCookies = require('../../utils/decodeToken.js');


const {sendUserData, sendUserDataByID,sendCustomerData } = require('../../controller/logIn.js');
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

        const t_sql=`
        SELECT * FROM CARS C
        JOIN COMPANY CO ON C.COMPANY_ID = CO.ID
        JOIN CARTYPE CA ON C.TYPE_ID = CA.TYPE_ID
        JOIN USERS U ON C.COMPANY_ID = U.ID
        ORDER BY DBMS_RANDOM.VALUE
        FETCH FIRST 5 ROWS ONLY
        `
        const trending = await execute(t_sql,{});


        if( isLoggedIn == 'false' || isLoggedIn == undefined )
        {
            const sql="SELECT TYPE_NAME,CAR_TYPE_URL FROM CARTYPE";
            const sql2="SELECT NAME FROM USERS WHERE USER_TYPE = 'CO'";
            car_types=await execute(sql,{});
            //console.log(car_types);
            company_names=await execute(sql2,{});
            //console.log(company_names);
            res.render('index2',{car_types: car_types,company_names: company_names,authorized: "false",user:"user",user_info:[{ID: 0}],trending:trending});
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
            res.render('index2',{car_types: car_types,company_names: company_names,authorized: "true" , user: user,user_info:user_info,trending:trending});
        }

    })
    .post( async (req, res) => {
        res.write("Post is sent");
    })
    
mainHomeRouter
    .route('/showBrandWise')
    .get( async ( req, res ) => {
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
                res.render('car_details',{authorized:authorized,user_info:[{ID: 0,NAME:"DDD"}],product:product})
            }
            else {
                authorized = "true";
                const user_info = await sendUserDataByID(user_id);
                res.render('car_details',{authorized:authorized,user_info:user_info,product:product})
            }
        })

    mainHomeRouter
        .route('/cardetails/comment')
        .post( authorization, async(req,res)=>{
            try {
                console.log(req.body);

                const {email,password} = req.user;
                const user_info = await sendUserData(email,password);

                const user_id = user_info[0].ID;
                const {model_color_id, comment_text} = req.body;

                const result = await addComment(model_color_id, user_id, comment_text);
                res.status(200).json({message: "comment added successfully"});

            }catch(error) {
                console.log(error);
            }
        });

    mainHomeRouter
        .route('/cardetails/editcomment')
        .get( authorization, async(req,res)=>{
            try {
            
                const comment_id = req.body.comment_id;
                const comment_text = req.body.comment_text;

                const result = await editComment(comment_id, comment_text);

                res.status(200).json({message: "comment edited successfully"});
            }catch(error) {
                console.log(error);
            }
        });

     mainHomeRouter
        .route('/cardetails/rate')
        .post( authorization, async(req,res)=>{
            try {
                console.log(req.body);

                const {email,password} = req.user;
                const user_info = await sendUserData(email,password);
                const user_id = user_info[0].ID;

                const { model_color_id, rating } = req.body;

                const result = await addRating(model_color_id, user_id, rating);
                res.status(200).json({message: "product rated successfully"});

            }catch(error) {
                console.log(error);
            }
        });

    mainHomeRouter
        .route('/cardetails/updateRating')
        .post( authorization, async(req,res)=>{
            try {
                console.log(req.body);

                const {email,password} = req.user;
                const user_info = await sendUserData(email,password);
                const user_id = user_info[0].ID;

                const { model_color_id, rating } = req.body;

                const result = await updateRating(model_color_id, user_id, rating);
                res.status(200).json({message: "raitng updated successfully"});

            }catch(error) {
                console.log(error);
            }
        });


    mainHomeRouter
        .route('/myinfo')
        .get(authorization,async(req,res)=> {
            const {email,password} = req.user;
            const userDetails = await sendCustomerData(email,password);
            console.log(userDetails);
            if(userDetails[0].LOCATION_ID == 0) {
                res.render('customerInfo',{user_info:userDetails,authorized:"true",location:[{LOCATION_ID:0,COUNTRY:"",DIVISION:"",CITY:""}]});
            }
            else {
                const location = await sendLocationDataByLocationId(userDetails[0].LOCATION_ID);
                res.render('customerInfo',{user_info:userDetails,authorized:"true",location:location});
            }
            
        })

    mainHomeRouter
        .route('/editInfo') 
        .get(authorization,async(req,res)=>{
            const {email,password} = req.user;
            const userDetails = await sendCustomerData(email,password);
            console.log(userDetails);
            if(userDetails[0].LOCATION_ID == 0) {
                res.render('editCustomerInfo',{user_info:userDetails,authorized:"true",location:[{ID:0,DIVISION:"",CITY:""}]});
            }
            else {
                const location =await sendLocationDataByLocationId(userDetails[0].LOCATION_ID);
                res.render('editCustomerInfo',{user_info:userDetails,authorized:"true",location:location});
            }
        })

    mainHomeRouter
        .route('/updateInfo')
        .post(async(req,res)=>{
            const {
                email,
                name,
                phone,
                division,
                city,
                id
            } = req.body
            console.log(id)
            var result =await updateCustomerData(email,name,phone,division,city,id);
            if(result == 1) {
                res.json({message: "email"})
            }
            if(result == 2) {
                res.json({message: "phone"})
            }
            if(result == 0) {
                res.json({message: "ok"})
            }
        })










    // here i will implement the route for /company 

    // mainHomeRouter
    //     .route('/companyHome')
    //     .get( async (req,res) =>
    //     {
    //         res.render('companyHome');
    //     })

    module.exports = mainHomeRouter;