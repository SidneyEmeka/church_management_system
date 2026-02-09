const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (authHeader && authHeader.startsWith("Bearer")) {
    const theToken = authHeader.split(" ")[1];

    if (!theToken) {
      return res.status(400).send({
        success: false,
        message: `Acceess Denied`,
        data: `Access Token not Found`,
      });
    }
     else {
      try {
      //  console.log(theToken)
       const decode = jwt.verify(theToken, process.env.JWT_SECRET);
       req.theUser = decode;
       console.log(`Decoded = `, req.theUser)
       next();
      } catch (err) {
        res.status(500).send({
          success: false,
          message: "Acccess Denied",
          data: err.message,
        });
      }
    }
  }
  else{
     return res.status(400).send({
        success: false,
        message: `Acceess Denied`,
        data: `Authorization missing`,
      });
  }
};

module.exports = verifyToken;
