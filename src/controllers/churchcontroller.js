const profileObject = require("../models/userprofilemodel.js");
const churchObject = require("../models/churchmodel.js");
const donationObject = require("../models/donationsmodel.js");

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
        .populate("pastor", "name -_id"); //that that particular church has that members id

      if (alreadyAmember) {
        res.status(200).send({
          success: false,
          message: `You are already a member of this church`,
          data: alreadyAmember,
        });
      } else {
        theChurch.members.push(userID);
        await theChurch.save();

        const churchName = theChurch.name;
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
        .populate("pastor", "name -_id"); //that that particular church has that members id

      if (isAmember) {
        theChurch.members = theChurch.members.filter(
          (member) => member.toString() !== userID.toString(),
        );
        await theChurch.save();

        const churchName = isAmember.name;
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

const createADonation = async (req, res) => {
  const churchId = req.body.church;
  const pastorID = req.params.id;

  try {
    const theChurch = await churchObject
      .findById(churchId)
      .select("-__v -createdAt -updatedAt");

    if (theChurch) {
      const heIsThePastor = await churchObject.findOne({
        _id: churchId,
        pastor: pastorID,
      });

      if (heIsThePastor) {
        const alreadyexists = await donationObject.findOne({
          donationName: req.body.donationName,
          church: churchId,
        });
        if (alreadyexists) {
          res.status(400).send({
            success: false,
            message: `Unable to create donation`,
            data: "Donation with this name already exists in this church",
          });
        } else {
          const theDonationBody = donationObject({
            church: churchId,
            ...req.body,
          });

          await theDonationBody.save();

          const theDonation = await donationObject
            .findById(theDonationBody._id)
            .populate("church");

          res.status(200).send({
            success: true,
            message: `Your ${theDonationBody.donationName} donation is now open`,
            data: theDonation,
          });
        }
      } else {
        res.status(400).send({
          success: false,
          message: `Unable to create donation`,
          data: "You are not the pastor of this church",
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to create donation`,
        data: "Church with this Id does not exist",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to create a donation",
      data: err.message,
    });
  }
};

const makeADonation = async (req, res) => {
  const userID = req.params.id;
  const donationId = req.body.donationId;

  try {
    const donationExists = await donationObject.findOne({ _id: donationId }).populate('donators.user');

    if (donationExists) {
     donationExists.donators.push({
        user: userID,
        donated: req.body.donated,
        transactionId: req.body.transactionId,
        paymentVerified: false,
      });

      await donationExists.save();

      res.status(200).send({
        success: true,
        message: `Your donation to ${donationExists.donationName} has been received, upon verification [Usually 24hrs] we would send an appreciation email`,
        data: donationExists,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to make donation`,
        data: "Donation with this Id does not exist",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to make donation",
      data: err.message,
    });
  }
};

///todo
//get all churches

//get alllchurchesofauseer
//const churches = await churchObject.find({ members: userID });

//get all donations
//get a donation
//verify payment

module.exports = {
  createAchurch,
  joinAchurch,
  exitAChurch,
  createADonation,
  makeADonation,
};
