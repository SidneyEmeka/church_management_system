const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authmiddleware.js");
const authorizeRoles = require("../middleware/rolemidddleware.js");
const { createAchurch,joinAchurch,exitAChurch,createADonation,
  makeADonation,verifyDonation,getAllDonationsForAChurch, 
  getAllPastorChurches, getAllUserChurches,editDonationStatus,
sendEmailToAllMembers } = require("../controllers/churchcontroller.js")


router.patch("/joinchurch/:id",verifyToken,joinAchurch);

router.patch("/exitchurch/:id",verifyToken,exitAChurch);

router.patch("/makedonation/:id", verifyToken, makeADonation);

router.get("/getdonations/:churchId", verifyToken, getAllDonationsForAChurch);

router.get("/getuserchurches/:id", verifyToken, getAllUserChurches);






/**
 * @access  Only Role = Pastor
 */

//create a church
router.post("/createchurch/:pastorId", verifyToken,authorizeRoles("pastor"), createAchurch);

router.post("/createdonation/:pastorId", verifyToken,authorizeRoles("pastor"), createADonation);

router.patch("/verifydonation", verifyToken,authorizeRoles("pastor"), verifyDonation);

router.get("/getchurches/:pastorId", verifyToken,authorizeRoles("pastor"), getAllPastorChurches);

router.patch("/editdonationstatus", verifyToken,authorizeRoles("pastor"), editDonationStatus);

router.post("/sendemailtoall", verifyToken,authorizeRoles("pastor"), sendEmailToAllMembers);




router.get("/pastor", verifyToken, authorizeRoles("pastor"), (req,res)=>{
 res.status(201).send({
      success: true,
      message: `Pastor Successful`,
      data: "Welcome Pastor",
    });
})







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