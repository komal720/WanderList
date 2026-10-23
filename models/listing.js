
const { required } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },

    // GEOMETRY FOR MAPBOX
  geometry: {
    type: {
        type: String,
        enum: ["Point"],
        required:true
    },
    coordinates: {
        type: [Number],
        default: [0, 0],
        required:true
    }
},

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
