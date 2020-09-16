const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const colors = require("colors");
const errorHandler = require("./middleware/error.js");
const findUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const xss = require("xss-clean");

//load env file
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

// Route files

const bootcamps = require("./router/bootcamp.js");
const courses = require("./router/courses.js");
const auth = require("./router/auth.js");
const users = require("./router/users.js");
const reviews = require("./router/reviews.js");

const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(findUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Preven XXS attacks
app.use(xss());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(apiLimiter);

// Prevent http params pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, "public"))); //  localhost uploads/.....

//Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold),
);

//Handle unhandled promise rejection
process.on("unhandledRejection", (error, promise) => {
  console.log(`error ${error.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
