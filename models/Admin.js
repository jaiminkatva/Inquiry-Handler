import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  userName: {
    type: String,
    unique:true,
  },
  collegeName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Admin", adminSchema);
