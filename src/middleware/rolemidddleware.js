const authorizeRoles = (theTokenRole) => {
return (req,res,next) => {
if(theTokenRole == req.theUser.role){
     next();
}
else{
    res.status(403).send({
      success: false,
      message: `Access Denied`,
      data: `The role '${req.theUser.role}' is not allowed for this route`,
    });
}
}
}


module.exports = authorizeRoles;