const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authmiddleware.js");
const { createOrUpdateProfile,getUserProfile } = require("../controllers/usercontrollers.js")


router.post("/createprofile", verifyToken, createOrUpdateProfile);

router.get("/getprofile",verifyToken, getUserProfile);




module.exports = router;