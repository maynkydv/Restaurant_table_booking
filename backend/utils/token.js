const jwt = require("jsonwebtoken");
require('dotenv').config();

// generate the Jwt token with SECRET_KEY which expires in 10 min
module.exports.generateToken = async(payload)=> {
    const token = jwt.sign(payload , process.env.SECRET_KEY ,{ expiresIn: 10 * 60  }); // takes time in sec
    return token ;
}

// verify the token integrity
module.exports.verifyToken = async(token)=> {
    return jwt.verify(token , process.env.SECRET_KEY);
}

