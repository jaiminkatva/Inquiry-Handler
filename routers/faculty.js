import express from "express";
import {
  facultyLogin,
  facultyLogout,
  getFacultyLogin,
  facultyDashboard,
  getFacultyInquiry,
  getInquiryForm,
  appointCounselor,
  updateAppointCounselor,
  showInquiryDetails,
  addForm,
  getUnappointedInquiries,
} from "../controllers/facultyController.js";
const router = express.Router();

router.get("/faculty-login", getFacultyLogin);
router.post("/faculty-login", facultyLogin);
router.get("/faculty-login", facultyLogout);
router.get("/faculty-dashboard", facultyDashboard);
router.get("/faculty/inquiry-data", getFacultyInquiry);
router.get("/faculty/Unappointed-inquiry-data", getUnappointedInquiries);
router.get("/inquiry-form", getInquiryForm);
router.post("/inquiry", addForm);

router.get("/edit/:id", appointCounselor);
router.post("/edit/:id", updateAppointCounselor);

router.get("/show/:id", showInquiryDetails);

export default router;
