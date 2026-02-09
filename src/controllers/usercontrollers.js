


var jwt = require('jsonwebtoken');


export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_WEB_TOKEN_SECRET, { expiresIn: "15m" });
}

export const allRefreshTokens = [];
export const generateRefreshsToken = (user) => {
    const rToken = jwt.sign(user, process.env.REFRESH_WEB_TOKEN_SECRET);
    allRefreshTokens.push(rToken);
    return rToken;
}

// Middleware (your existing middleware)
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const theToken = authHeader.split(' ')[1];
        console.log(`The token: ${theToken}`);
        console.log(authHeader);
        
        jwt.verify(theToken, process.env.ACCESS_WEB_TOKEN_SECRET, (err, foundUser) => {
            if (err) {
                return res.status(403).send({
                    "message": `Invalid Token`, 
                    "data": `Kindly use a correct token: ${err}`
                });
            }
            console.log(foundUser);
            req.foundUser = foundUser;
            next();
        });
    } else {
        res.status(400).send({
            "message": `Requires Token`, 
            "data": `Kindly use an Authorization Token`
        });
    }
}