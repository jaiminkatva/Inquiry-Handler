import express from "express";
import {
  addRemarks,
  conformInquiry,
  counselorDashboard,
  counselorInquiry,
  counselorLogin,
  counselorLogout,
  getCounselorAdmittedStatus,
  getCounselorCancelStatus,
  getCounselorLogin,
  getCounselorPendingStatus,
  getRemarksForm,
  postUpdateAllInquiry,
  removeRemarks,
  showInquiryData,
  updateAllInquiry,
  updateConformInquiry,
} from "../controllers/counselorController.js";
const router = express.Router();

router.get("/counselor-login", getCounselorLogin);
router.post("/counselor-login", counselorLogin);
router.get("/counselor-logout", counselorLogout);
router.get("/counselor-dashboard", counselorDashboard);
router.get("/confirm-inquiry", counselorInquiry);
router.get("/cPendingCounselor", getCounselorPendingStatus);
router.get("/cAdmittedCounselor", getCounselorAdmittedStatus);
router.get("/cCancelCounselor", getCounselorCancelStatus);
router.get("/counselor-edit/:id", conformInquiry);
router.post("/counselor-edit/:id", updateConformInquiry);
router.get("/counselor-show/:id", showInquiryData);
router.get("/counselor-all-edit/:id", updateAllInquiry);
router.post("/counselor-all-edit/:id", postUpdateAllInquiry);
router.get("/remarks/:id", getRemarksForm);
router.post("/remarks/:id", addRemarks);
router.get("/remarks/remove/:id", removeRemarks);

export default router;
