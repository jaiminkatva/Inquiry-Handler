import express from "express";
import {
  addAdmin,
  dashboard,
  deleteCollegeRequest,
  deleteSingleAdmin,
  editSingleAdmin,
  getAdminData,
  getAdminForm,
  getCounselorData,
  getEditSingleAdmin,
  getFacultyData,
  getMasterLogin,
  getMasterRegister,
  getRequestData,
  logoutMaster,
  masterLogin,
  masterRegister,
  showRequestDetails,
} from "../controllers/masterController.js";
const router = express.Router();

router.get("/master-login", getMasterLogin);
router.post("/master-login", masterLogin);
router.get("/master-register", getMasterRegister);
router.post("/master-register", masterRegister);
router.get("/master-logout", logoutMaster);
router.get("/master-dashboard", dashboard);

router.get("/master/college-requests", getRequestData);
router.get("/request/show/:id", showRequestDetails);
router.get("/request/delete/:id", deleteCollegeRequest);
router.get("/addAdmin", getAdminForm);
router.post("/addAdmin", addAdmin);
router.get("/admin-list", getAdminData);
router.get("/master/counselor-list", getCounselorData);
router.get("/master/faculty-list", getFacultyData);
router.get("/master/delete/:id", deleteSingleAdmin);
router.get("/master/edit/:id", getEditSingleAdmin);
router.post("/master/edit/:id", editSingleAdmin);

export default router;
