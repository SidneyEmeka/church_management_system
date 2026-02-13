const mongoose = require("mongoose");

const churchSchema = mongoose.Schema(
  {
    pastor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Church name is required"],
    },
    name: {
      type: String,
      required: [true, "Church name is required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Church address is required"],
    },
    supportContact: {
      type: {
        phone: {
          type: String,
          required: [true, "Church Support Telephone Number is required"],
        },
        email: {
          type: String,
          required: [true, "Church Support Email is required"],
           lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
        website: String,
      },
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
  },
  { timestamps: true },
);

churchSchema.virtual("activeMembersCount").get(function () {
  return this.members?.length || 0;
}); //just a method to create a virtual field that calculates the members, this is not stored in db

module.exports = mongoose.model("Church", churchSchema);
