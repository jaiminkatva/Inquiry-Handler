import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
  },
});

export default mongoose.model("Course", courseSchema);
