const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authmiddleware.js");
const authorizeRoles = require("../middleware/rolemidddleware.js");
const { createOrUpdateProfile } = require("../controllers/usercontrollers.js")


router.post("/createprofile", verifyToken, createOrUpdateProfile)

/**
 * @access  Only Role = Pastor
 */

router.get("/pastor", verifyToken, authorizeRoles("pastor"), (req,res)=>{
 res.status(201).send({
      success: true,
      message: `Pastor Successful`,
      data: "Welcome Pastor",
    });
})

///crete church





/**
 * @access  Only Role = member
 */

router.get("/member",verifyToken,authorizeRoles("member"), (req,res)=>{
 res.status(201).send({
      success: true,
      message: `Registeration Successful`,
      data: "A verification link has been sent to you. Kindly verify your email address",
    });
})

//join church



module.exports = router;