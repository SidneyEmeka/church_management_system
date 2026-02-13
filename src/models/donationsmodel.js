const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
  {
    church: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Church',
      required: [true, "Church name is required"],
    },
    donationName: {
      type: String,
      required: [true, "Donation name is required"],
    },
    bankDetails: {
      accountName: String,
    accountNumber: String,
    bankName: String,
      required: [true, "Donation bank details is required"],
    },
     donationSupportContact: {
     phone: String,
    email: String,
    },
    donationDetails: {
     minAmount: Number,
    totalGotten: Number,
    },
  },
  { timestamps: true },
);


module.exports = mongoose.model('Donatoin', donationSchema);