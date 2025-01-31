import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
  facultyName: {
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

export default mongoose.model("Faculty", facultySchema);
