const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authmiddleware.js");
const authorizeRoles = require("../middleware/rolemidddleware.js");
const { createAchurch,joinAchurch,exitAChurch } = require("../controllers/churchcontroller.js")


router.patch("/joinchurch/:id",verifyToken,joinAchurch);

router.patch("/exitchurch/:id",verifyToken,exitAChurch);




/**
 * @access  Only Role = Pastor
 */

//create a church
router.post("/createChurch/:id", verifyToken,authorizeRoles("pastor"), createAchurch);


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