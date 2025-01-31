import mongoose from "mongoose";

const branchSchema = mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  createdBy:{
    type: String,
  }
});

export default mongoose.model("Branch", branchSchema);