const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const path = require("path");
const fs = require("fs");
const validator = require("validator");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be longer than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
      maxlength: [500, "Description cannot be longer than 50 characters"],
    },
    website: {
      type: String,
      match: [
        /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
        "Please use a valid URL with HTTP, HTTPS",
      ],
    },
    phone: {
      type: String,
      match: [
        /1?\s?((\(\d{3}\))|(\d{3}))(-|\s)?\d{3}(-|\s)?\d{4}/,
        "Please use a valid phone",
      ],
    },
    email: {
      type: String,
      // match: [
      //   /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      //   "Please use a valid email",
      // ],
      validate: (value) => {
        if(!validator.isEmail(value)){
          throw new Error(`Please use a valid email`)
        }
      },
      required: [true, "Please add a email"],
    },
    address: {
      type: String,
      required: [true, "Please add a address"],
    },
    location: {
      //GeoJSON Point
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAdress: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // user Schema
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  },
);

//Create bootCamp slug from the name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAdress: loc[0].formattedAdress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //dont save address  in DB
  this.address = undefined;
  next();
});

// Cascade delete course when a bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  console.log(`Course is being deleted by id ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
  // const filePath = path.join(__dirname, '..', 'public', 'uploads', this.photo); //go to root file
  // fs.unlink(filePath, (err) => console.log(err));
});

// Reverse populate with virtuals
BootcampSchema.virtual("courses", {
  //name of populate
  ref: "Course", // Schema
  localField: "_id",
  foreignField: "bootcamp", // FIeld in Course Schema
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
