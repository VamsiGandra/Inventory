const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    default: ''
  },
  numberOfItems: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Product', ProductSchema);