import mongoose from "mongoose";

const remarkSchema = mongoose.Schema({
  remarks: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  student: {
    type: String,
  },
});

export default mongoose.model("Remark", remarkSchema);
