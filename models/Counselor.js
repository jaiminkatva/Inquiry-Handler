import mongoose from "mongoose";

const counselorSchema = mongoose.Schema({
  counselorName: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
  }
});

export default mongoose.model("Counselor", counselorSchema);
