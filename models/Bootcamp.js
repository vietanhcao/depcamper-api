const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
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
		// match: [
		// 	/1?\s?((\(\d{3}\))|(\d{3}))(-|\s)?\d{3}(-|\s)?\d{4}/,
		// 	"Please use a valid phone",
		// ],
	},
	address: {
		type: String,
		required: [true, "Please add a address"],
	},
	// location: {
	// 	//GeoJSON Point
	// 	type: {
	// 		type: String, // Don't do `{ location: { type: String } }`
	// 		enum: ["Point"], // 'location.type' must be 'Point'
	// 		required: true,
	// 	},
	// 	coordinates: {
	// 		type: [Number],
	// 		required: true,
	// 		index: "2dsphere",
	// 	},
	// 	formattedAdress: String,
	// 	street: String,
	// 	city: String,
	// 	state: String,
	// 	zipCode: String,
	// 	country: String,
	// },
	careers: {
		type: [String],
		required: true,
		enum: ["Web Development", "Mobile Development", "UI/UX", "Data Science", "Business"],
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
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
