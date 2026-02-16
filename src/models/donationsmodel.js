const mongoose = require("mongoose");

const donationSchema = mongoose.Schema(
  {
    church: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
      required: [true, "Church name is required"],
    },
    donationName: {
      type: String,
      required: [true, "Donation name is required"],
     // unique:[true, `Donation with this name already exists`]
    },
    donationStatus: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["on", "off", "completed"],
        message: 'Status must be either "on","off","completed"',
      },
    },
    startDate: {
      type: Date,
      required: [true, "Donation start date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Start date must be in the future",
      },
    },
    endDate: {
      type: Date,
      required: [true, "Donation end date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate && value > new Date();
        },
        message: "End date must be after start date and in the future",
      },
    },
    donationDescription: {
      type: String,
      required: [true, "Description of the donation is required"],
    },
    bankDetails: {
      type: {
        accountName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
      },
      required: [true, "Donation bank details is required"],
    },
    donationSupportContact: {
      type: {
        phone: { type: String, required: true },
        email: {
          type: String,
          required: true,
          lowercase: true,
          match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
      },
      required: [true, "Donation contact details is required"],
    },
    donationMetrics: {
      type: {
        targetAmount: { type: Number, required: true },
        minAmount: { type: Number, required: true },
        totalGotten: { type: Number, default: 0 },
      },
      required: [true, "Donation Metrics is required"],
    },
    donators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        donated: Number,
        transactionId: String,
        paymentVerified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", donationSchema);
