import Branch from "../models/Branch.js";
import Counselor from "../models/Counselor.js";
import Course from "../models/Course.js";
import Faculty from "../models/Faculty.js";
import Inquiry from "../models/Inquiry.js";
import Remark from "../models/Remark.js";

const deleteInquiry = async (req, res) => {
  Inquiry.deleteMany({})
    .then((result) => {
      console.log(result);
      res.redirect("/faculty/inquiry-data");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message });
    });
};
const deleteCounselor = async (req, res) => {
  Counselor.deleteMany({})
    .then((result) => {
      console.log(result);
      res.redirect("/counselor-list");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message });
    });
};
const deleteFaculty = async (req, res) => {
  Faculty.deleteMany({})
    .then((result) => {
      console.log(result);
      res.redirect("/faculty-list");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message });
    });
};
const deleteBranch = async (req, res) => {
  Branch.deleteMany({})
    .then((result) => {
      console.log(result);
      res.redirect("/branch-list");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message });
    });
};
const deleteCourse = async (req, res) => {
  Course.deleteMany({})
    .then((result) => {
      console.log(result);
      res.redirect("/course-list");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message });
    });
};
const deleteRemarks = async (req, res) => {
  Remark.deleteMany({})
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err.message });
    });
};

export {
  deleteCourse,
  deleteRemarks,
  deleteBranch,
  deleteInquiry,
  deleteFaculty,
  deleteCounselor,
};
