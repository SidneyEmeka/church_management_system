const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authObject = require("../models/authprofilemodel");
const {fetchProfileForLogin } = require("../controllers/usercontrollers.js")


const register = async (req, res) => {
  try {
    if (req.body.password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const body = {
      password: hashedPassword,
      role: req.body.role,
      email: req.body.email,
      invitedBy: req.body.invitedBy,
    };

    // Check if email already exists
    const existingUser = await authObject.findOne({ email: body.email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email already exists",
      });
    }

    const newUser = new authObject(body);

    await newUser.save();

    res.status(201).send({
      success: true,
      message: `Registeration Successful`,
      data: "A verification link has been sent to you. Kindly verify your email address",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Registeration not successful",
      data: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    console.log(`logiiiiiiii`);
    const body = { email: req.body.email, password: req.body.password };

    const theUser = await authObject.findOne({ email: body.email });

    if (theUser) {
      const isMatch = await bcrypt.compare(body.password, theUser.password);
      console.log(`Matchh? ${isMatch}`);
      if (isMatch) {
        const token = jwt.sign(
          { id: theUser._id, role: theUser.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

       const userProfile = await fetchProfileForLogin(theUser._id);
        

        res.status(200).send({
          success: true,
          message: `Login Successful`,
          data: {
            User: {
              //id: theUser._id,
             // name: theUser.name,
              email: theUser.email,
              role: theUser.role,
              //age: theUser.age,
              //address: theUser.address,
             // dob: theUser.dob,
             // phoneNumber: theUser.phoneNumber,
              //email: theUser.email,
              profile: userProfile.data,
              invitedBy: theUser.invitedBy,
              isProfileComplete: theUser.isProfileComplete,
              createdAt: theUser.createdAt,
            },
            token: token,
          },
        });
      } else {
        return res.status(400).send({
          success: false,
          message: `Log in not Successful`,
          data: `Incorrect Email or Password`,
        });
      }
    } else {
      return res.status(404).send({
        success: false,
        message: `Log in not Successful`,
        data: `User with email ${body.email} not found`,
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Login not successful",
      data: err.message,
    });
    console.log(err)
  }
};

module.exports = {
  register,
  login,
};
