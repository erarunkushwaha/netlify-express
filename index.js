const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
// const { createProxyMiddleware } = require('http-proxy-middleware');
var cors = require("cors");
const userRoute = require("./route/user");
const authRoute = require("./route/auth");
const postRoute = require("./route/posts");
const multer = require("multer");
const path = require("path");

dotenv.config();

// connect to db

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("MONGO server is runnung");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), function (req, res, next) {
  try {
    res.status(200).json("file uploaded seuccessfully");
  } catch (error) {
    console.log(error);
  }
});
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is runnung");
});
