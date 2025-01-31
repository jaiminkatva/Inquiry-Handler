import express from "express";
const router = express.Router();
import {
  getBranchForm,
  addBranch,
  getBranchData,
  getAdminLogin,
  adminLogin,
  dashboard,
  getInquiry,
  getCounselorForm,
  addCounselor,
  getCounselorData,
  getFacultyForm,
  addFaculty,
  getFacultyData,
  logout,
  singleInquiryDetails,
  deleteSingleBranch,
  deleteSingleInquiry,
  deleteSingleFaculty,
  deleteSingleCounselor,
  editSingleInquiry,
  updateSingleInquiry,
  getCourseForm,
  addCourse,
  getCourseData,
  deleteSingleCourse,
  getCollegeAdmittedStatus,
  getCollegePendingStatus,
  getCollegeCancelStatus,
  getAdminInquiry,
} from "../controllers/adminController.js";

router.get("/admin-dashboard", dashboard);

router.get("/login", getAdminLogin);
router.post("/login", adminLogin);
router.get("/logout", logout);

// Branch
router.get("/addBranch", getBranchForm);
router.post("/addBranch", addBranch);
router.get("/branch-list", getBranchData);
router.get("/branch/delete/:id", deleteSingleBranch);

// Course
router.get("/addCourse", getCourseForm);
router.post("/addCourse", addCourse);
router.get("/course-list", getCourseData);
router.get("/course/delete/:id", deleteSingleCourse);

// Counselor
router.get("/addCounselor", getCounselorForm);
router.post("/addCounselor", addCounselor);
router.get("/counselor-list", getCounselorData);

// Faculty
router.get("/addFaculty", getFacultyForm);
router.post("/addFaculty", addFaculty);
router.get("/faculty-list", getFacultyData);

// Inquiry
router.get("/inquiries", getInquiry);
router.get("/admin_admitted_inq", getCollegeAdmittedStatus);
router.get("/admin_pending_inq", getCollegePendingStatus);
router.get("/admin_cancel_inq", getCollegeCancelStatus);
// router.get("/counselor-show/:id", showInquiryData);
router.get("/admin/inquiry-data", getAdminInquiry);

router.get("/single-inquiry/:id", singleInquiryDetails);
router.get("/delete/single-inquiry/:id", deleteSingleInquiry);
router.get("/edit/single-inquiry/:id", editSingleInquiry);
router.post("/edit/single-inquiry/:id", updateSingleInquiry);
router.get("/faculty/delete/:id", deleteSingleFaculty);
router.get("/counselor/delete/:id", deleteSingleCounselor);

export default router;
