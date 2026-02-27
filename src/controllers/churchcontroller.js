const profileObject = require("../models/userprofilemodel.js");
const churchObject = require("../models/churchmodel.js");
const donationObject = require("../models/donationsmodel.js");

const stripe = require("stripe")(process.env.STRIPE_KEY);

///CHURCCH///
const createAchurch = async (req, res) => {
  //get pastors ID after creating his profile or after logging

  const pastorID = req.params.pastorId;
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
  const pastorID = req.params.pastorId;

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
  // const donationId = req.body.donationId;
  // const userEmail = req.body;

  const { donationId, useremail } = req.body;

  try {
    const donationExists = await donationObject
      .findOne({ _id: donationId })
      .populate("donators.user", "name -_id");

    if (donationExists) {
      const currentDate = new Date();
      if (currentDate <= donationExists.endDate) {
        //check status
        if (donationExists.donationStatus === "on") {
          if (req.body.donated >= donationExists.donationMetrics.minAmount) {
            ///INITTIATE SESSION
            const session = await stripe.checkout.sessions.create({
              client_reference_id: userID,
              customer_email: useremail,
              line_items: [
                {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: donationExists.donationName,
                      //id: 'produuct id'
                    },
                    unit_amount: req.body.donated * 100,
                  },
                  quantity: 1,
                },
              ],
              mode: "payment",
              success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${process.env.BASE_URL}/cancel`,
            });
            console.log(session);
            const paymentId = session.id;
            const paymentUrl = session.url;

            donationExists.donators.push({
              user: userID,
              donated: req.body.donated,
              transactionId: paymentId,
              paymentVerified: false,
            });

            await donationExists.save();

            res.status(200).send({
              success: true,
              message: `Your donation to ${donationExists.donationName} has been initiated. Kindly visit the url below to complete payment`,
              data: {
                Id: paymentId,
                url: paymentUrl,
              },
            });

            // res.status(200).send({
            //   success: true,
            //   message: `Your donation to ${donationExists.donationName} has been received, upon verification [Usually 24hrs] we would send an appreciation email`,
            //   data: donationExists,
            // });
          } else {
            res.status(404).send({
              success: false,
              message: `Unable to make donation`,
              data: `Minimum donation amount is ${donationExists.donationMetrics.minAmount}`,
            });
          }
        } else if (donationExists.donationStatus === "completed") {
          res.status(200).send({
            success: false,
            message: `Unable to make donation`,
            data: "The target for this donation has been achieved",
          });
        } else {
          res.status(200).send({
            success: false,
            message: `Unable to make donation`,
            data: "This donation is not open yet",
          });
        }
      } else {
        // if (currentDate < donationExists.startDate) {
        //   return res.status(400).send({
        //     success: false,
        //     message: `Unable to make donation`,
        //     error: `This donation starts on ${donationExists.startDate.toLocaleDateString()}`,
        //   });
        // }

        // if (currentDate > donationExists.endDate) {
        return res.status(400).send({
          success: false,
          message: `Unable to make donation`,
          error: `This donation ended on ${donationExists.endDate.toLocaleDateString()}`,
        });
        //}
      }
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

const editDonationStatus = async (req, res) => {
  const { donationId, churchId, status } = req.body;

  try {
    const donationExists = await donationObject.findOne({
      _id: donationId,
      church: churchId,
    });

    if (donationExists) {
      if (["on", "off", "completed"].includes(status)) {
        donationExists.donationStatus = status;
        await donationExists.save();

        res.status(200).send({
          success: true,
          message: `Donation status changed`,
          data: donationExists,
        });
      } else {
        res.status(400).send({
          success: false,
          message: `Unable to edit donation status`,
          data: "Donation status must be on, off or completed",
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: `Unable to edit donation status`,
        data: "Donation not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to edit donation status",
      data: err.message,
    });
  }
};

const getAllDonationsForAChurch = async (req, res) => {
  const churchId = req.params.churchId;

  try {
    const theChurch = await churchObject.findOne({ _id: churchId });
    if (theChurch) {
      const allDonations = await donationObject
        .find({ church: churchId })
        .populate("donators.user", "name phoneNumber");
      res.status(200).send({
        success: true,
        message: `These are the available donations for ${theChurch.name}`,
        data: allDonations,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to get donations`,
        data: "Church with this Id does not exist",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to get donations",
      data: err.message,
    });
  }
};

const verifyDonation = async (req, res) => {
  const { donationId, transactionId } = req.body;

  try {
    const hasbeenVerified = await donationObject.findOne({
      _id: donationId,
      "donators.transactionId": transactionId,
      "donators.paymentVerified": true,
    });
    if (hasbeenVerified) {
      res.status(200).send({
        success: false,
        message: `Unable to verify donations`,
        data: "This donation has already been verified",
      });
    } else {
      const theDonation = await donationObject.findOne({
        _id: donationId,
        "donators.transactionId": transactionId,
      });
      const donatorIndex = theDonation.donators.findIndex(
        (d) => d.transactionId.toString() === transactionId,
      );
      if (donatorIndex !== -1) {
        const donaetedAmount = theDonation.donators[donatorIndex].donated;

        const session = await stripe.checkout.sessions.retrieve(transactionId);

        //console.log(session);

        if (session.payment_status === "paid") {
          const updatedDonation = await donationObject
            .findOneAndUpdate(
              {
                _id: donationId,
                "donators.transactionId": transactionId,
              },
              {
                $set: { "donators.$.paymentVerified": true },
                $inc: { "donationMetrics.totalGotten": donaetedAmount },
              },

              { new: true },
            )
            .populate("donators.user", "name phoneNumber");

          res.status(200).send({
            success: true,
            message: `Payment verified`,
            data: updatedDonation,
          });
        } else {
          return res.status(200).send({
            success: true,
            message: `Payment not successful`,
            error: `This payment's transaction was not successful`,
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to verify donation",
      data: err.message,
    });
  }
};

const getAllPastorChurches = async (req, res) => {
  const pastorId = req.params.pastorId;
  try {
    const theChurches = await churchObject
      .find({ pastor: pastorId })
      .select("-__v -createdAt -updatedAt")
      .populate(
        "members pastor",
        "-_id -authDetails -__v -createdAt -updatedAt",
      );
    console.log(pastorId);
    if (theChurches.length > 0) {
      res.status(200).send({
        success: true,
        message: `You have ${theChurches.length} church(es)`,
        data: theChurches,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to fetch churches`,
        data: "You do not have any churches",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to fetch churches",
      data: err.message,
    });
  }
};

const getAllUserChurches = async (req, res) => {
  const userId = req.params.id;

  try {
    const theUserChurches = await churchObject
      .find({ members: userId })
      .select("-__v -createdAt -updatedAt -members")
      .populate("pastor", "-_id -__v -createdAt -updatedAt -authDetails");
    if (theUserChurches.length > 0) {
      res.status(200).send({
        success: true,
        message: `You are in ${theUserChurches.length} church(es)`,
        data: theUserChurches,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `Unable to fetch churches`,
        data: "You are not a member of any church yet",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Unable to fetch churches",
      data: err.message,
    });
  }
};

///todo

//get alllchurchesofauseer
//const churches = await churchObject.find({ members: userID });

//get a donation

module.exports = {
  createAchurch,
  joinAchurch,
  exitAChurch,
  createADonation,
  makeADonation,
  getAllDonationsForAChurch,
  verifyDonation,
  getAllPastorChurches,
  getAllUserChurches,
  editDonationStatus,
};
