import Branch from "../models/Branch.js";
import Faculty from "../models/Faculty.js";
import Inquiry from "../models/Inquiry.js";
import Counselor from "../models/Counselor.js";
import Course from "../models/Course.js";
import moment from "moment";
import getNextSequenceValue from "../services/autoIncrement.js";

// Get Login Form
const getFacultyLogin = async (req, res) => {
  const timeout = 3000;
  res.render("faculty/login", { title: "Inquiry Handler Login", timeout });
};

// Post Login Process
const facultyLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.findOne({ email, password });
    if (!faculty) {
      console.log("Inquiry handler not found");
      req.session.message = {
        type: "danger",
        message: "Invalid credential",
      };
      return res.redirect("/faculty-login");
    }
    req.session.faculty = faculty;
    req.session.facultyName = faculty.facultyName;
    console.log(faculty.facultyName);
    res.redirect("/faculty-dashboard");
  } catch (err) {
    console.log(err);
    req.session.message = {
      type: "danger",
      message: "Invalid credential",
    };
    res.redirect("/faculty-login");
  }
};

// Logout for Faculty
const facultyLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// Faculty Dashboard
const facultyDashboard = async (req, res) => {
  if (req.session.faculty) {
    Inquiry.find({ formFilledBy: req.session.facultyName })
      .then((inquiries) => {
        Inquiry.find({
          formFilledBy: req.session.facultyName,
          status: "Admitted",
        }).then((inq_a_status) => {
          Inquiry.find({
            formFilledBy: req.session.facultyName,
            status: "Pending",
          }).then((inq_p_status) => {
            Inquiry.find({
              formFilledBy: req.session.facultyName,
              status: "Cancel",
            }).then((inq_c_status) => {
              Inquiry.find({
                formFilledBy: req.session.facultyName,
                counselorName: { $in: ["",null] },
              }).then((inq_unAppointed) => {
                console.log(inq_unAppointed);
                res.render("faculty/dashboard", {
                  title: "Inquiry Handler Dashboard",
                  total_inquiry: inquiries.length,
                  total_admitted: inq_a_status.length,
                  total_pending: inq_p_status.length,
                  total_cancel: inq_c_status.length,
                  total_unAppointed: inq_unAppointed.length,
                });
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
    res.redirect("/faculty-login");
  }
};

const getInquiryForm = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
    Branch.find({ createdBy: req.session.faculty.createdBy })
      .then((users) => {
        Course.find({ createdBy: req.session.faculty.createdBy }).then(
          (courses) => {
            res.render("faculty/inquiry-form", {
              title: "Inquiry Form",
              users: users,
              courses: courses,
            });
          }
        );
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  }
};

const addForm = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
    const nextId = await getNextSequenceValue("userId");

    const inquiry = new Inquiry({
      formNo: req.session.faculty.createdBy + nextId,
      fullName: req.body.fullName,
      mobileNo: req.body.mobileNo,
      parentsMobileNo: req.body.parentsMobileNo,
      address: req.body.address,
      board: req.body.board,
      schoolName: req.body.schoolName,
      referenceName: req.body.referenceName,
      counselorName: req.body.counselorName,
      formFilledBy: req.session.faculty.facultyName,
      priority_one: req.body.priority_one,
      priority_two: req.body.priority_two,
      priority_three: req.body.priority_three,
      admission_category: req.body.admission_category,
      seat_no: req.body.seat_no,
      result: req.body.result,
      college: req.session.faculty.createdBy,
    });
    inquiry
      .save()
      .then(() => {
        console.log(req.session.faculty);
        req.session.message = {
          type: "success",
          message: "Inquiry Submitted Successfully",
        };
        res.redirect("/inquiry-form");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "info",
            message: "inquiry Already exist",
          };
          res.redirect("/inquiry-form");
        } else {
          req.session.message = {
            type: "info",
            message: "something going wrong..",
          };
          res.redirect("/inquiry-form");
        }
      });
  }
};

const getFacultyInquiry = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
    Inquiry.find({ formFilledBy: req.session.faculty.facultyName })
      .then((inquiries) => {
        res.render("faculty/faculty-inquiry-data", {
          title: "Inquiry Data",
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

const getUnappointedInquiries = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
    Inquiry.find({
      formFilledBy: req.session.faculty.facultyName,
      counselorName: { $in: ["",null] },
    })
      .then((inquiries) => {
        res.render("faculty/faculty-inquiry-data", {
          title: "Inquiry Data",
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

const showInquiryDetails = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
    let id = req.params.id;
    Inquiry.findById(id)
      .then((users) => {
        res.render("faculty/show-inquiry-details", {
          title: "Inquiry Details",
          users: users,
          moment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  }
};

// Appoint Counselor Form
const appointCounselor = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
    let id = req.params.id;
    Inquiry.findById(id)
      .then((inquiries) => {
        Counselor.find({ createdBy: req.session.faculty.createdBy })
          .then((users) => {
            res.render("faculty/appoint-inquiry", {
              title: "Appoint Counselor",
              inquiries: inquiries,
              users: users,
            });
          })
          .catch((err) => {
            console.log(err);
            res.send("Internal Server Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  }
};

// Update Counselor
const updateAppointCounselor = async (req, res) => {
  if (!req.session.faculty) {
    res.redirect("/faculty-login");
  } else {
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
      counselorName: req.body.counselorName,
    })
      .then(() => {
        console.log("Counselor Appoint Successfully");
        req.session.message = {
          type: "success",
          message: "Counselor appointed Successfully",
        };
        res.redirect("/faculty/inquiry-data");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "success",
          message: "Something going wrong",
        };
        res.redirect("/faculty/Unappointed-inquiry-data");
      });
  }
};

export {
  getFacultyLogin,
  facultyLogin,
  facultyLogout,
  getInquiryForm,
  getFacultyInquiry,
  addForm,
  showInquiryDetails,
  updateAppointCounselor,
  appointCounselor,
  facultyDashboard,
  getUnappointedInquiries,
};
