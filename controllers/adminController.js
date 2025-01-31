import moment from "moment";
import Admin from "../models/Admin.js";
import Inquiry from "../models/Inquiry.js";
import Branch from "../models/Branch.js";
import Faculty from "../models/Faculty.js";
import Counselor from "../models/Counselor.js";
import Course from "../models/Course.js";
import Remark from "../models/Remark.js";

// Get Admin Register Form
const getAdminRegister = async (req, res) => {
  res.render("admin-register", { title: "College Register" });
};

// Post Admin Register data
const adminRegister = async (req, res) => {
  const admin = new Admin({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
  admin.save();
  console.log("College Registered SuccessFully");
  res.redirect("/login");
};

// Get admin Login Form
const getAdminLogin = async (req, res) => {
  res.render("admin/login", { title: "College Login" });
};

// Post Admin Login Process
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      console.log("College not found");
      req.session.message = {
        type: "danger",
        message: "Invalid credential",
      };
      return res.redirect("/login");
    }
    req.session.admin = admin;
    req.session.userName = admin.userName;
    req.session.collegeName = admin.collegeName;
    req.session._id = admin._id;
    console.log(admin.collegeName);
    res.redirect("/admin-dashboard");
  } catch (err) {
    console.log(err);
    req.session.message = {
      type: "danger",
      message: "Invalid credential",
    };
    res.redirect("/login");
  }
};

// Logout for Admin
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// Dashboard for Admin
const dashboard = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Inquiry.find({ college: req.session.userName }).then((inquiries) => {
      Faculty.find({ createdBy: req.session.userName }).then((faculties) => {
        Counselor.find({ createdBy: req.session.userName }).then(
          (counselors) => {
            Inquiry.find({
              college: req.session.userName,
              status: "Admitted",
            }).then((admitted_inq) => {
              Inquiry.find({
                college: req.session.userName,
                status: "Pending",
              }).then((pending_inq) => {
                Inquiry.find({
                  college: req.session.userName,
                  status: "Cancel",
                }).then((cancelled_inq) => {
                  Inquiry.find({
                    college: req.session.userName,
                    counselorName: { $in: ["", null] },
                  }).then((unappointed_inq) => {
                    Branch.find({ createdBy: req.session.userName }).then(
                      (branches) => {
                        res.render("admin/home", {
                          title: "College Dashboard",
                          total_inquiry: inquiries.length,
                          total_faculty: faculties.length,
                          total_counselor: counselors.length,
                          total_branch: branches.length,
                          total_admitted_inq: admitted_inq.length,
                          total_pending_inq: pending_inq.length,
                          total_cancelled_inq: cancelled_inq.length,
                          total_unappointed_inq: unappointed_inq.length,
                        });
                      }
                    );
                  });
                });
              });
            });
          }
        );
      });
    });
  }
};

// Branch Form
const getBranchForm = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    res.render("admin/branch-form", { title: "Add Branch" });
  }
};

// Branch Post
const addBranch = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    const branch = new Branch({
      branchName: req.body.branchName,
      createdBy: req.session.userName,
    });
    branch
      .save()
      .then(() => {
        console.log("Add Branch Successfully");
        req.session.message = {
          type: "success",
          message: "Branch Added Successfully",
        };
        res.redirect("/branch-list");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "warning",
            message: "Branch Already exist",
          };
          res.redirect("/addBranch");
        } else {
          req.session.message = {
            type: "danger",
            message: "something going wrong..",
          };
          res.redirect("/addBranch");
        }
      });
  }
};

// Get All Branch
const getBranchData = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Branch.find({ createdBy: req.session.userName })
      .then((branches) => {
        res.render("admin/branch-list", {
          title: "Branch List",
          users: branches,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Delete Branch
const deleteSingleBranch = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Branch.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Branch deleted successfully.",
        };
        res.redirect("/branch-list");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "warning",
          message: "Something went wrong.",
        };
        res.redirect("/branch-list");
      });
  }
};

// Faculty Form
const getFacultyForm = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    res.render("admin/faculty-form", { title: "Add Faculty" });
  }
};

// faculty Post
const addFaculty = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    const faculty = new Faculty({
      facultyName: req.body.facultyName,
      mobileNo: req.body.mobileNo,
      password: req.body.password,
      email: req.body.email,
      createdBy: req.session.userName,
    });
    faculty
      .save()
      .then(() => {
        console.log("Add Faculty Successfully");
        req.session.message = {
          type: "success",
          message: "Faculty Add Successfully",
        };
        res.redirect("/faculty-list");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "success",
            message: "Faculty Already exist",
          };
          res.redirect("/faculty-list");
        } else {
          req.session.message = {
            type: "danger",
            message: "something going wrong..",
          };
          res.redirect("/faculty-list");
        }
      });
  }
};

// Get All Faculty
const getFacultyData = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Faculty.find({ createdBy: req.session.userName })
      .then((faculties) => {
        res.render("admin/faculty-list", {
          title: "Faculty list",
          users: faculties,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Delete Branch
const deleteSingleFaculty = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Faculty.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Faculty removed successfully.",
        };
        res.redirect("/faculty-list");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something went wrong.",
        };
        res.redirect("/faculty-list");
      });
  }
};

// Counselor Form
const getCounselorForm = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    res.render("admin/counselor-form", { title: "Add Counselor" });
  }
};

// Counselor Post
const addCounselor = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    const counselor = new Counselor({
      counselorName: req.body.counselorName,
      mobileNo: req.body.mobileNo,
      password: req.body.password,
      email: req.body.email,
      createdBy: req.session.userName,
    });
    counselor
      .save()
      .then(() => {
        console.log("Add Counselor Successfully");
        req.session.message = {
          type: "success",
          message: "Counselor added successfully..",
        };
        res.redirect("/counselor-list");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "warning",
            message: "Counselor username or email is already exist.",
          };
          res.redirect("/counselor-list");
        } else {
          req.session.message = {
            type: "danger",
            message: "something going wrong..",
          };
          res.redirect("/counselor-list");
        }
      });
  }
};

// Get All Counselor
const getCounselorData = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Counselor.find({ createdBy: req.session.userName })
      .then((counselors) => {
        res.render("admin/counselor-list", {
          title: "Counselor List",
          users: counselors,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Delete Counselor
const deleteSingleCounselor = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Counselor.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Counselor removed successfully.",
        };
        res.redirect("/counselor-list");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something went wrong.",
        };
        res.redirect("/counselor-list");
      });
  }
};

// Get All Faculty inquiry
const getInquiry = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Inquiry.find({ college: req.session.userName })
      .then((inquiries) => {
        res.render("admin/inquiry-data", {
          title: "All Inquiries",
          users: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Get single inquiry details
const singleInquiryDetails = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Inquiry.findById(id)
      .then((users) => {
        Remark.find().then((data) => {
          res.render("admin/single-inquiry-details", {
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

const deleteSingleInquiry = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Inquiry.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Inquiry Deleted Successfully.",
        };
        res.redirect("/inquiries");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "something want wrong.",
        };
        res.redirect("/inquiries");
      });
  }
};

const editSingleInquiry = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Branch.find({ createdBy: req.session.userName }).then((branches) => {
      Course.find({ createdBy: req.session.userName }).then((courses) => {
        Counselor.find({ createdBy: req.session.userName }).then(
          (counselors) => {
            Inquiry.findById(id).then((users) => {
              res.render("admin/editInq", {
                title: "Edit Single Inquiry",
                branches,
                counselors,
                courses,
                users,
              });
            });
          }
        );
      });
    });
  }
};

const updateSingleInquiry = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Inquiry.findByIdAndUpdate(id, {
      fullName: req.body.fullName,
      mobileNo: req.body.mobileNo,
      parentsMobileNo: req.body.parentsMobileNo,
      address: req.body.address,
      board: req.body.board,
      schoolName: req.body.schoolName,
      referenceName: req.body.referenceName,
      counselorName: req.body.counselorName,
      formFilledBy: req.body.facultyName,
      priority_one: req.body.priority_one,
      counselorName: req.body.counselorName,
      admission_category: req.body.admission_category,
      seat_no: req.body.seat_no,
      result: req.body.result,
      status: req.body.status,
    })
      .then(() => {
        console.log("Inquiry Conformation");
        req.session.message = {
          type: "success",
          message: "inquiry data updated...",
        };
        res.redirect("/inquiries");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something is wrong",
        };
        res.redirect("/inquiries");
      });
  }
};

// Course Form
const getCourseForm = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    res.render("admin/course-form", { title: "Add Course" });
  }
};

// Course Post
const addCourse = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    const course = new Course({
      courseName: req.body.courseName,
      createdBy: req.session.userName,
    });
    course
      .save()
      .then(() => {
        console.log("Add Course Successfully");
        req.session.message = {
          type: "success",
          message: "Course Added Successfully",
        };
        res.redirect("/course-list");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "warning",
            message: "Course Already exist",
          };
          res.redirect("/addCourse");
        } else {
          req.session.message = {
            type: "danger",
            message: "something going wrong..",
          };
          res.redirect("/addCourse");
        }
      });
  }
};

// Get All Course
const getCourseData = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Course.find({ createdBy: req.session.userName })
      .then((courses) => {
        res.render("admin/course-list", {
          title: "Course List",
          users: courses,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Delete Course
const deleteSingleCourse = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    Course.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Course deleted successfully.",
        };
        res.redirect("/course-list");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "warning",
          message: "Something went wrong.",
        };
        res.redirect("/course-list");
      });
  }
};

// Pending Inquiry of a Counselor
const getCollegePendingStatus = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Inquiry.find({
      college: req.session.userName,
      status: "Pending",
    })
      .then((inquiries) => {
        res.render("admin/inquiry-data", {
          title: "Pending Inquiries",
          users: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Admitted Inquiry of a Counselor
const getCollegeAdmittedStatus = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Inquiry.find({
      college: req.session.userName,
      status: "Admitted",
    })
      .then((inquiries) => {
        res.render("admin/inquiry-data", {
          title: "Admitted Inquiries",
          users: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Cancel Inquiry of a Counselor
const getCollegeCancelStatus = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Inquiry.find({
      college: req.session.userName,
      status: "Cancel",
    })
      .then((inquiries) => {
        res.render("admin/inquiry-data", {
          title: "Cancelled Inquiries",
          users: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Show single inquiry details
// const showInquiryData = async (req, res) => {
//   if (!req.session.admin) {
//     res.redirect("/login");
//   } else {
//     let id = req.params.id;
//     Inquiry.findById(id)
//       .then((users) => {
//         Remark.find().then((data) => {
//           res.render("counselor/show-inquiry-details", {
//             title: "Inquiry Details",
//             users: users,
//             data,
//             moment,
//           });
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send("Internal Server Error");
//       });
//   }
// };

// Unappointed Admin Inquiries
const getAdminInquiry = async (req, res) => {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    Inquiry.find({
      college: req.session.userName,
      counselorName: { $in: ["", null] },
    })
      .then((inquiries) => {
        res.render("admin/inquiry-data", {
          title: "Unappointed Inquiries",
          users: inquiries,
          total_inquiry: inquiries.length,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

export {
  adminRegister,
  getAdminRegister,
  getAdminLogin,
  adminLogin,
  dashboard,
  getBranchForm,
  addBranch,
  getBranchData,
  getCounselorForm,
  addCounselor,
  getCounselorData,
  getFacultyForm,
  addFaculty,
  getFacultyData,
  logout,
  getInquiry,
  singleInquiryDetails,
  deleteSingleBranch,
  deleteSingleInquiry,
  deleteSingleCounselor,
  deleteSingleFaculty,
  editSingleInquiry,
  updateSingleInquiry,
  getCourseForm,
  addCourse,
  getCourseData,
  deleteSingleCourse,
  getCollegeAdmittedStatus,
  getCollegeCancelStatus,
  getCollegePendingStatus,
  getAdminInquiry,
};
