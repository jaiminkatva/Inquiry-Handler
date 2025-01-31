import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import session from "express-session";
import mongoose from "mongoose";

const app = express();

// Router
import indexRouter from "./routers/index.js";
import adminRouter from "./routers/admin.js";
import counselorRouter from "./routers/counselor.js";
import facultyRouter from "./routers/faculty.js";
import masterRouter from "./routers/master.js";

mongoose.set("strictQuery", false);

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.userName = req.session.userName;
  res.locals.collegeName = req.session.collegeName;
  res.locals.counselorName = req.session.counselorName;
  res.locals.facultyName = req.session.facultyName;
  next();
});

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("public"));

// set template engine
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/", adminRouter);
app.use("/", counselorRouter);
app.use("/", facultyRouter);
app.use("/", masterRouter);

const port = process.env.PORT || 3000;

const start = () => {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Database Connected");
  app.listen(port, () => {
    console.log(`Server started on port no ${port}`);
  });
};

start();
