import Counselor from "../models/Counselor.js";
import Inquiry from "../models/Inquiry.js";
import Branch from "../models/Branch.js";
import moment from "moment";
import Remark from "../models/Remark.js";
import Course from "../models/Course.js";

// Get Login Form
const getCounselorLogin = async (req, res) => {
  res.render("counselor/login", { title: "Counselor Login" });
};

// Post Login Process
const counselorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const counselor = await Counselor.findOne({ email, password });
    if (!counselor) {
      console.log("Counselor not found");
      req.session.message = {
        type: "danger",
        message: "Invalid credential",
      };
      return res.redirect("/counselor-login");
    }
    req.session.counselor = counselor;
    req.session.counselorName = counselor.counselorName;
    console.log(counselor.counselorName);
    res.redirect("/counselor-dashboard");
  } catch (err) {
    console.log(err);
    req.session.message = {
      type: "danger",
      message: "Invalid credential",
    };
    res.redirect("/counselor-login");
  }
};

// Logout for Counselor
const counselorLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// Counselor Dashboard
const counselorDashboard = async (req, res) => {
  if (req.session.counselor) {
    Inquiry.find({ counselorName: req.session.counselorName })
      .then((inquiries) => {
        Inquiry.find({
          counselorName: req.session.counselorName,
          status: "Admitted",
        }).then((inq_a_status) => {
          Inquiry.find({
            counselorName: req.session.counselorName,
            status: "Pending",
          }).then((inq_p_status) => {
            Inquiry.find({
              counselorName: req.session.counselorName,
              status: "Cancel",
            }).then((inq_c_status) => {
              res.render("counselor/home", {
                title: "Counselor Dashboard",
                total_inquiry: inquiries.length,
                total_admitted: inq_a_status.length,
                total_pending: inq_p_status.length,
                total_cancel: inq_c_status.length,
              });
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  } else {
    res.redirect("/counselor-login");
  }
};

// Counselor Inquiry list
const counselorInquiry = async (req, res) => {
  if (req.session.counselor) {
    Inquiry.find({ counselorName: req.session.counselorName })
      .then((user) => {
        res.render("counselor/counselor-inquiry", {
          title: "Counselor Appointed Inquiries",
          user: user,
          total_inquiry: user.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  } else {
    res.redirect("/counselor-login");
  }
};

// edit inquiry conformation
const conformInquiry = async (req, res) => {
  if (req.session.counselor) {
    let id = req.params.id;
    Branch.find({ createdBy: req.session.counselor.createdBy }).then(
      (branches) => {
        Inquiry.findById(id).then((users) => {
          res.render("counselor/inquiry-conformation", {
            title: "Inquiry Confirmation",
            branches,
            users,
          });
        });
      }
    );
  } else {
    res.redirect("/counselor-login");
  }
};

// post edit inquiry conformation
const updateConformInquiry = async (req, res) => {
  let id = req.params.id;

  Inquiry.findByIdAndUpdate(id, {
    priority_one: req.body.priority_one,
    status: req.body.status,
  })
    .then(() => {
      console.log("Inquiry Conformation");
      req.session.message = {
        type: "success",
        message: "inquiry data updated...",
      };
      res.redirect("/confirm-inquiry");
    })
    .catch((err) => {
      console.log(err);
      req.session.message = {
        type: "danger",
        message: "Something is wrong",
      };
      res.redirect("/confirm-inquiry");
    });
};

const showInquiryData = async (req, res) => {
  if (!req.session.counselor) {
    res.redirect("/counselor-login");
  } else {
    let id = req.params.id;
    Inquiry.findById(id)
      .then((users) => {
        Remark.find().then((data) => {
          res.render("counselor/show-inquiry-details", {
            title: "Inquiry Details",
            users: users,
            data,
            moment,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  }
};

// Pending Inquiry of a Counselor
const getCounselorPendingStatus = async (req, res) => {
  if (req.session.counselor) {
    Inquiry.find({
      counselorName: req.session.counselorName,
      status: "Pending",
    })
      .then((inquiries) => {
        res.render("counselor/counselor-inquiry", {
          title: "Dashboard",
          user: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  } else {
    res.redirect("/counselor-login");
  }
};

// Admitted Inquiry of a Counselor
const getCounselorAdmittedStatus = async (req, res) => {
  if (req.session.counselor) {
    Inquiry.find({
      counselorName: req.session.counselorName,
      status: "Admitted",
    })
      .then((inquiries) => {
        res.render("counselor/counselor-inquiry", {
          title: "Dashboard",
          user: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  } else {
    res.redirect("/counselor-login");
  }
};

// Cancel Inquiry of a Counselor
const getCounselorCancelStatus = async (req, res) => {
  if (req.session.counselor) {
    Inquiry.find({ counselorName: req.session.counselorName, status: "Cancel" })
      .then((inquiries) => {
        res.render("counselor/counselor-inquiry", {
          title: "Dashboard",
          user: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  } else {
    res.redirect("/counselor-login");
  }
};

const updateAllInquiry = async (req, res) => {
  if (req.session.counselor) {
    let id = req.params.id;
    Course.find({ createdBy: req.session.counselor.createdBy })
      .then((courses) => {
        Inquiry.findById(id).then((users) => {
          res.render("counselor/updateInquiry", {
            title: "Update Inquiry",
            courses,
            users,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  } else {
    res.redirect("/counselor-login");
  }
};

const postUpdateAllInquiry = async (req, res) => {
  let id = req.params.id;

  Inquiry.findByIdAndUpdate(id, {
    formNo: req.body.formNo,
    fullName: req.body.fullName,
    mobileNo: req.body.mobileNo,
    parentsMobileNo: req.body.parentsMobileNo,
    address: req.body.address,
    board: req.body.board,
    schoolName: req.body.schoolName,
    referenceName: req.body.referenceName,
    formFilledBy: req.body.facultyName,
    admission_category: req.body.admission_category,
  })
    .then(() => {
      console.log("Inquiry Conformation");
      req.session.message = {
        type: "success",
        message: "inquiry data updated...",
      };
      res.redirect("/confirm-inquiry");
    })
    .catch((err) => {
      console.log(err);
      req.session.message = {
        type: "danger",
        message: "Something is wrong",
      };
      res.redirect("/confirm-inquiry");
    });
};

// Remarks Form
const getRemarksForm = async (req, res) => {
  if (!req.session.counselor) {
    res.redirect("/login");
  } else {
    const { id } = req.params;
    Inquiry.findById(id).then((user) => {
      res.render("counselor/remarks-form", { title: "Add Remarks", user });
    });
  }
};

const addRemarks = async (req, res) => {
  if (!req.session.counselor) {
    res.redirect("/login");
  } else {
    const remarks = {
      remarks: req.body.remarks,
      student: req.body.student,
      date: Date.now(),
    };
    Remark.create(remarks)
      .then(() => {
        console.log(remarks);
        console.log("Add Remarks Successfully");
        req.session.message = {
          type: "success",
          message: "Remarks Added Successfully",
        };
        res.redirect("/confirm-inquiry");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "warning",
            message: "Branch Already exist",
          };
          res.redirect("/confirm-inquiry");
        } else {
          req.session.message = {
            type: "danger",
            message: "something going wrong..",
          };
          res.redirect("/confirm-inquiry");
        }
      });
  }
};

const removeRemarks = async (req, res) => {
  if (!req.session.counselor) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    await Remark.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Remark deleted successfully.",
        };
        res.redirect("/confirm-inquiry");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "warning",
          message: "Something went wrong.",
        };
        res.redirect("/confirm-inquiry");
      });
  }
};

export {
  getCounselorLogin,
  counselorLogin,
  counselorLogout,
  counselorDashboard,
  counselorInquiry,
  conformInquiry,
  updateConformInquiry,
  showInquiryData,
  getCounselorPendingStatus,
  getCounselorAdmittedStatus,
  getCounselorCancelStatus,
  updateAllInquiry,
  postUpdateAllInquiry,
  getRemarksForm,
  addRemarks,
  removeRemarks,
};
