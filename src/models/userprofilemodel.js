const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
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
    authDetails:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    unique: true
    }
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