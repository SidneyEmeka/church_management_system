const profileObject = require("../models/userprofilemodel.js");
const churchObject = require("../models/churchmodel.js");
const authObject = require("../models/authprofilemodel.js");

///PROFFILE
const createOrUpdateProfile = async (req, res) => {
  const userId = req.theUser.id;
  console.log(`His Id is ${userId}`);

  const profileData = req.body;
//dob as YYYY-MM-DD
  try {
    let profile = await profileObject.findOne({ authDetails: userId });

    if (profile) {
      profile = await profileObject
        .findOneAndUpdate({ authDetails: userId }, { ...profileData })
        .populate("authDetails", "-password -_id -createdAt -updatedAt -__v");

      await authObject.findByIdAndUpdate(userId, {
        isProfileComplete: true,
      });

      res.status(201).send({
        success: true,
        message: `Profile Updated`,
        data: profile,
      });
    } else {
      profile = profileObject({
        authDetails: userId,
        ...profileData,
      });

      await profile.save();
      await authObject.findByIdAndUpdate(userId, {
        isProfileComplete: true,
      });

      profile = await profileObject
        .findById(profile._id)
        .populate("authDetails", "-password -_id -createdAt -updatedAt -__v");

      res.status(201).send({
        success: true,
        message: `Profile Created`,
        data: profile,
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Profile Creation not successful",
      data: err.message,
    });
  }
};





//fetch a user's profile
const getUserProfile = async (req, res) => {
  const userId = req.theUser.id;
  console.log(userId, "rrs");

  try {
    const theProfile = await profileObject
      .findOne({ authDetails: userId })
      .populate("authDetails", "-_id -password -__v -createdAt -updatedAt");
    console.log(theProfile);

    if (theProfile) {
      res.status(200).send({
        success: true,
        message: `Profile found`,
        data: theProfile,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Profile not found",
        data: "You do not have any profile",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Profile not found",
      data: err.message,
    });
  }
};





const fetchProfileForLogin = async (authId) => {
  const userId = authId;

  try {
    const theProfile = await profileObject
      .findOne({ authDetails: userId })
      .select("-authDetails -__v -createdAt -updatedAt");

    if (theProfile) {
      return { data: theProfile };
    } else {
      return { data: null };
    }
  } catch (err) {
    return { data: null };
  }
};

module.exports = {
  createOrUpdateProfile,
  getUserProfile,
  fetchProfileForLogin,
};
