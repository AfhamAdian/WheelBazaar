const express = require('express');
const { execute } = require('../DB/dbConnect.js');
const path = require('path');


// Assuming __dirname is the 'route' directory
const routeDirectory = __dirname;
//console.log('Route Directory:', routeDirectory);

// Construct the absolute path to the 'view' directory
const viewDirectory = path.join(routeDirectory, '..', 'views');
//console.log('Absolute Path to View Directory:', viewDirectory);

// Construct the absolute path to the desired file in the 'view' directory
const filePathInView = path.join(viewDirectory, 'page1.html');
//console.log('Absolute Path to File in View Directory:', filePathInView);


const homeRouter = express.Router();
homeRouter
    .route('/')
    .get((req,res) => {
        res.sendFile(filePathInView);
        //res.render('index',{});
    })
    .post( async ( req, res ) => {
        //console.log(req.body);
        const text = req.body.searchBar;
        //console.log( text );
        const query_text= "SELECT * FROM USERS WHERE LOWER(NAME) LIKE LOWER('%" + text + "%')";
        const results = await execute(query_text,{});
        //console.log( results );
        if(results.length > 0)
            res.json(results);
        else 
            res.json([]);
    })


homeRouter
    .route('/deleteTest')
    .post(async(req,res) => {

        const {
            id
        } = req.body;

        console.log(id);

        const query_text = 'DELETE FROM USERS WHERE ID = :id';
        const binds = {
           id
        }
        await execute(query_text,binds);
    })
homeRouter
    .route('/updateTest')
    .post(async(req,res) => {
        
        console.log('post dhukse');
        const id = req.body.id;
        const password = req.body.password;

        console.log(id);

        const query_text = 'UPDATE USERS SET PASSWORD = :password WHERE ID = :id';
        const binds = {
           password,id
        }
        await execute(query_text,binds);
    })

module.exports = homeRouter; 



