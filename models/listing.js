
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    type: {
      filename: String,
      url: String,
    },
    default: {
      filename: "listingimage",
      url: "https://www.shutterstock.com/image-illustration/a-striking-illustration-lord-shiva-260nw-2327766159.jpg",
    },
  },

  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
