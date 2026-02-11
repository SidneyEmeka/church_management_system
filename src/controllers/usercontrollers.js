const profileObject = require('../models/userprofilemodel.js')




///create or update profile
 const createOrUpdateProfile = async (req,res) => {

    const userId = req.theUser.id;
    console.log(`His Id is ${userId}`);

     const profileData = req.body;

     try{
        let profile = await profileObject.findOne({ authDetails: userId });

     if(profile){
        profile = await profileObject.findOneAndUpdate(
        { authDetails: userId },
        { ...profileData },
      ).populate('authDetails', '-password');;

      res.status(201).send({
      success: true,
      message: `Profile Updated`,
      data: profile
    });
     }

    else{
        profile =  profileObject({
      authDetails: userId,
      ...profileData
    });
    
    await profile.save();

   profile = await profileObject.findById(profile._id).populate('authDetails', '-password');


    res.status(201).send({
      success: true,
      message: `Profile Created`,
      data: profile
    });
     }
     }catch(err){
        res.status(500).send({
      success: false,
      message: "Profile Creation not successful",
      data: err.message,
    });
     }

}

module.exports = {
  createOrUpdateProfile
};
