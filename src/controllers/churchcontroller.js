const profileObject = require("../models/userprofilemodel.js");
const churchObject = require("../models/churchmodel.js");

///CHURCCH///
const createAchurch = async (req, res) => {
  //get pastors ID after creating his profile or after logging

  const pastorID = req.params.id;
  console.log(`Pastor Id is ${pastorID}`);

  const churchData = req.body;

  try {
    let church = await churchObject
      .findOne({ name: req.body.name })
      .populate({
        path: "pastor",
        select: "-_id -createdAt -updatedAt -__v",
        populate: {
          path: "authDetails",
          select: "-_id -password -createdAt -updatedAt -__v",
        },
      })
      .populate({
        path: "members",
        select: "-_id -createdAt -updatedAt -__v",
        populate: {
          path: "authDetails",
          select: "-_id -password -createdAt -updatedAt -__v",
        },
      });

    if (church) {
      //   profile = await profileObject.findOneAndUpdate(
      //   { authDetails: userId },
      //   { ...profileData },
      // ).populate('authDetails', '-password');;

      res.status(200).send({
        success: false,
        message: `Church Name Already exists`,
        data: church,
      });
    } else {
      church = churchObject({
        pastor: pastorID,
        ...churchData,
        members: [pastorID], //adds the pastor as the first id in members
      });

      await church.save();

      church = await churchObject
        .findById(church._id)
        .populate({
          path: "pastor",
          select: "-_id -createdAt -updatedAt -__v",
          populate: {
            path: "authDetails",
            select: "-_id -password -createdAt -updatedAt -__v",
          },
        })
        .populate({
          path: "members",
          select: "-_id -createdAt -updatedAt -__v",
          populate: {
            path: "authDetails",
            select: "-_id -password -createdAt -updatedAt -__v",
          },
        });

      res.status(201).send({
        success: true,
        message: `Church Created`,
        data: church,
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Church Creation not successful",
      data: err.message,
    });
  }
};

const joinAchurch = async (req, res) => {
  const churchId = req.params.id;
  const userID = req.body.userId;
  try {
    const theChurch = await churchObject
      .findById(churchId)
      .select("-__v -createdAt -updatedAt");

    if (theChurch) {
      const alreadyAmember = await churchObject
        .findOne({ _id: churchId, members: userID })
        .select("-__v -createdAt -updatedAt -members")
        .populate("pastor", "name -_id") //that that particular church has that members id

      if (alreadyAmember) {
        res.status(200).send({
          success: false,
          message: `You are already a member of this church`,
          data: alreadyAmember,
        });
      } else {
        theChurch.members.push(userID);
        await theChurch.save();

         const churchName = theChurch.name
           const theChurchNow = await churchObject
      .findById(churchId)
      .select("-__v -createdAt -updatedAt -members");
        res.status(200).send({
          success: true,
          message: `You have successfully joined ${churchName}`,
          data: theChurchNow,
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to join church`,
        data: "Church with this Id does not exist",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to join church",
      data: err.message,
    });
  }
};

const exitAChurch = async (req, res) => {
  const churchId = req.params.id;
  const userID = req.body.userId;
  try {
    const theChurch = await churchObject
      .findById(churchId)
      .select("-__v -createdAt -updatedAt");

    if (theChurch) {
      const isAmember = await churchObject
        .findOne({ _id: churchId, members: userID })
        .select("-__v -createdAt -updatedAt -members")
        .populate("pastor", "name -_id") //that that particular church has that members id

      if (isAmember) {
         theChurch.members = theChurch.members.filter(
        member => member.toString() !== userID.toString()
    );
    await theChurch.save();
    
        const churchName = isAmember.name
        res.status(200).send({
          success: true,
          message: `You have successfully exited ${churchName}`,
          data: isAmember,
        });
      } else {
        res.status(400).send({
          success: false,
          message: `Unable to exit church`,
          data: "You are not a member of this church",
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to exit church`,
        data: "Church with this Id does not exist",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to exit church",
      data: err.message,
    });
  }
};


///todo
//get all churches

//get alllchurchesofauseer
//const churches = await churchObject.find({ members: userID });

module.exports = {
  createAchurch,
  joinAchurch,
  exitAChurch,
};
