const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: 6,
    },
    role: {
  type: String,
  required: [true, "Role is required"],
  enum: {
    values: ['pastor','member'],
    message: 'Role must be either "pastor", "volunteer", or "member"'
  }
},
    address: {
      type: String,
      required: [true, "User address is required"],
    },
    age: {
      type: Number,
      required: [true, "User age is required"],
      min: 13,
      max:99
    },
    dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        // Validate it's a past date (not in the future)
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }},
     phoneNumber: {
      type: Number,
      required: [true, "User phone is required"],
    },
   email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
    invitedBy: {
      type: String,
    },
    // cloudinaryPublicId: {
    //   type: String,
    //   required: [true, "Product img is required"],
    // },
    // quantity: {
    //   type: Number,
    //   required: [true, "Product available quantity is required"],
    // },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);