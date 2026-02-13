const mongoose = require('mongoose');

const authSchema = mongoose.Schema(
  {
  email: {
    type: String,
    required: [true, "User email is required"],
    unique: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
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
 invitedBy: {
     type: String,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    isProfileComplete: {
      type: Boolean,
      default: false 
    },
    
  },
  { timestamps: true },
);

module.exports = mongoose.model('Auth', authSchema);