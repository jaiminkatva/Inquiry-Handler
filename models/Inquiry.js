import mongoose from "mongoose";

const inquirySchema = mongoose.Schema({
  formNo: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  parentsMobileNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  referenceName: {
    type: String,
    required: true,
  },
  priority_one: {
    type: String,
    required: true,
  },
  priority_two: {
    type: String,
    required: true,
  },
  priority_three: {
    type: String,
    required: true,
  },
  formFilledBy: {
    type: String,
  },
  counselorName: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending",
  },
  admission_category: {
    type: String,
  },
  seat_no: {
    type: String,
  },
  result: {
    type: String,
  },
  college: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Inquiry", inquirySchema);
