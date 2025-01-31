import express from "express";
import {
  deleteBranch,
  deleteCounselor,
  deleteCourse,
  deleteFaculty,
  deleteInquiry,
  deleteRemarks,
} from "../controllers/deleteController.js";
import {
  addContact,
  collegeRegister,
  contactDetails,
  deleteContact,
} from "../controllers/masterController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("landing", { title: "Welcome" });
});
router.get("/start", (req, res) => {
  res.render("start", { title: "Get Start" });
});

router.post("/contactUs", addContact);
router.get("/contact-details", contactDetails);
router.get("/contact/delete/:id", deleteContact);

router.get("/collegeRegister", (req, res) => {
  res.render("collegeRegister");
});

router.post("/collegeRegister", collegeRegister);

router.get("/deleteInquiry", deleteInquiry);
router.get("/deleteFaculty", deleteFaculty);
router.get("/deleteCounselor", deleteCounselor);
router.get("/deleteBranch", deleteBranch);
router.get("/deleteCourse", deleteCourse);
router.get("/deleteRemarks", deleteRemarks);

export default router;
