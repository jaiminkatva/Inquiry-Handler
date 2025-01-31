import Master from "../models/Master.js";
import Admin from "../models/Admin.js";
import Counselor from "../models/Counselor.js";
import Faculty from "../models/Faculty.js";
import Inquiry from "../models/Inquiry.js";
import Request from "../models/Request.js";
import Contact from "../models/Contact.js";

// Get Admin Register Form
const getMasterRegister = async (req, res) => {
  res.render("master/register", { title: "Master Admin Register" });
};

// Post Admin Register data
const masterRegister = async (req, res) => {
  const master = new Master({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
  master
    .save()
    .then(() => {
      console.log("Master Admin Registered SuccessFully");
      res.redirect("/master-login");
    })
    .catch((err) => {
      console.log(err);
      req.session.message = {
        type: "danger",
        message: "Something went wrong!",
      };
      res.redirect("/master-register");
    });
};

// Get admin Login Form
const getMasterLogin = async (req, res) => {
  res.render("master/login", { title: "Master Admin Login" });
};

// Post Admin Login Process
const masterLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const master = await Master.findOne({ email, password });
    if (!master) {
      console.log("Master Admin not found");
      req.session.message = {
        type: "danger",
        message: "Please enter valid data",
      };
      return res.redirect("/master-login");
    }
    req.session.master = master;
    req.session.userName = master.userName;
    console.log(master.userName);
    res.redirect("/master-dashboard");
  } catch (err) {
    console.log(err);
    req.session.message = {
      type: "danger",
      message: "Please enter valid data",
    };
    res.redirect("/master-login");
  }
};

// Logout for Admin
const logoutMaster = (req, res) => {
  req.session.destroy();
  res.redirect("/master-login");
};

// Dashboard for Master Admin
const dashboard = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Inquiry.find().then((inquiries) => {
      Faculty.find().then((faculties) => {
        Counselor.find().then((counselors) => {
          Admin.find().then((admins) => {
            res.render("master/home", {
              title: "Dashboard",
              total_inquiry: inquiries.length,
              total_faculty: faculties.length,
              total_counselor: counselors.length,
              total_college: admins.length,
            });
          });
        });
      });
    });
  }
};

// College Form
const getAdminForm = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    res.render("master/admin-form", { title: "Add college Admin" });
  }
};

// College Post
const addAdmin = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    const admin = new Admin({
      userName: req.body.userName,
      collegeName: req.body.collegeName,
      mobileNo: req.body.mobileNo,
      password: req.body.password,
      email: req.body.email,
    });
    admin
      .save()
      .then(() => {
        console.log("Add admin Successfully");
        req.session.message = {
          type: "success",
          message: "Admin Added successfully",
        };
        res.redirect("/admin-list");
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          req.session.message = {
            type: "warning",
            message: "Admin Already exist",
          };
          res.redirect("/admin-list");
        } else {
          req.session.message = {
            type: "danger",
            message: "something going wrong..",
          };
          res.redirect("/admin-list");
        }
      });
  }
};

// Get All College
const getAdminData = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Admin.find()
      .then((admins) => {
        res.render("master/admin-list", {
          title: "Admin Data",
          users: admins,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Get All college Admin
const getInquiryData = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Inquiry.find()
      .then((inquiries) => {
        res.render("master/admin-list", {
          title: "Admin Data",
          users: inquiries,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Get All college Admin
const getFacultyData = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Faculty.find()
      .then((faculties) => {
        res.render("master/faculty-list", {
          title: "Faculty List",
          users: faculties,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

// Get All college Admin
const getCounselorData = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Counselor.find()
      .then((counselors) => {
        res.render("master/counselor-list", {
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

// Delete Admin
const deleteSingleAdmin = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    let id = req.params.id;
    Admin.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "college removed successfully.",
        };
        res.redirect("/admin-list");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something went wrong.",
        };
        res.redirect("/admin-list");
      });
  }
};

// Get Edit Admin
const getEditSingleAdmin = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    let id = req.params.id;
    Admin.findById(id).then((admin) => {
      res.render("master/editAdmin", {
        title: "Edit Admin",
        user: admin,
      });
    });
  }
};

// Edit Admin
const editSingleAdmin = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    let id = req.params.id;
    const updateData = req.body;
    Admin.findByIdAndUpdate(id, updateData, { new: true })
      .then(() => {
        req.session.message = {
          type: "success",
          message: "college Updated successfully.",
        };
        res.redirect("/admin-list");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something went wrong.",
        };
        res.redirect("/admin-list");
      });
  }
};

const collegeRegister = async (req, res) => {
  const newCollege = new Request({
    collegeName: req.body.collegeName,
    mobile: req.body.mobile,
    email: req.body.email,
    address: req.body.address,
    faculty: req.body.faculty,
    branch: req.body.branch,
    course: req.body.course,
    question: req.body.question || "",
  });

  newCollege
    .save()
    .then(() => {
      console.log("College registered successfully");
      req.session.message = {
        type: "success",
        message: "College registered successfully",
      };
      res.redirect("/collegeRegister"); // Redirect to a page showing a list of registered colleges
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        // Handle duplicate key error (if any field is unique)
        req.session.message = {
          type: "warning",
          message: "College already exists",
        };
      } else {
        req.session.message = {
          type: "danger",
          message: "Something went wrong while registering the college.",
        };
      }
      res.redirect("/collegeRegister"); // Redirect back to the college list page
    });
};

// Get All Request Admin
const getRequestData = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Request.find()
      .then((requestList) => {
        res.render("master/college-requests-list", {
          title: "Request List",
          users: requestList,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

const showRequestDetails = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    let id = req.params.id;
    Request.findById(id)
      .then((users) => {
        res.render("master/college-requests-details", {
          title: "College Request Details",
          users: users,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send("Internal Server Error");
      });
  }
};

const deleteCollegeRequest = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    let id = req.params.id;
    Request.findByIdAndDelete(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "college request removed successfully.",
        };
        res.redirect("/master/college-requests");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something went wrong.",
        };
        res.redirect("/master/college-requests");
      });
  }
};

const addContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const newContact = new Contact({
    name,
    email,
    subject,
    message,
  });

  await newContact
    .save()
    .then(() => {
      console.log("Add contact Successfully");
      req.session.message = {
        type: "success",
        message: "Message sent successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      req.session.message = {
        type: "danger",
        message: err.message || "something went wrong",
      };
      res.redirect("/");
    });
};

const contactDetails = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    Contact.find()
      .then((requestList) => {
        res.render("master/contact-details", {
          title: "Contact Details",
          users: requestList,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
};

const deleteContact = async (req, res) => {
  if (!req.session.master) {
    res.redirect("/master-login");
  } else {
    let id = req.params.id;
    Contact.findByIdAndRemove(id)
      .then(() => {
        req.session.message = {
          type: "success",
          message: "Contact Details removed successfully.",
        };
        res.redirect("/contact-details");
      })
      .catch((err) => {
        console.log(err);
        req.session.message = {
          type: "danger",
          message: "Something went wrong.",
        };
        res.redirect("/contact-details");
      });
  }
};

export {
  getMasterRegister,
  masterRegister,
  getMasterLogin,
  masterLogin,
  dashboard,
  logoutMaster,
  addAdmin,
  getAdminForm,
  getAdminData,
  getCounselorData,
  getFacultyData,
  getInquiryData,
  deleteSingleAdmin,
  editSingleAdmin,
  getEditSingleAdmin,
  collegeRegister,
  getRequestData,
  showRequestDetails,
  deleteCollegeRequest,
  addContact,
  contactDetails,
  deleteContact,
};
