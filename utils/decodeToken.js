const jwt = require('jsonwebtoken');
require("dotenv").config();


function decodeTokenFromCookies( token ) {
  // Extract the token from the cookie

  try {
    // Decode the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Return the decoded token
    return decodedToken;                // IN MY case it will return user 
  } catch (error) {

    console.error('Error decoding token:', error);
    return null;
  }
}


module.exports = decodeTokenFromCookies;

// Usage example
// const cookie = 'your_cookie_name=your_token_value';
// const decodedToken = decodeTokenFromCookies(cookie);
// console.log(decodedToken);
