const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authorization (req, res, next)
{
    try{
        const jwtToken = req.cookies.token;
        if(!jwtToken){
            return res.status(401).json("Not Authorized!");
        }
        const payload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
        console.log( "authorized user: ", payload.username);

        req.user = payload;
        
        next();
    }
    catch(err){
        console.error(err.message);
        return res.status(403).json("Not Authorized!");
    }
}

module.exports = authorization;