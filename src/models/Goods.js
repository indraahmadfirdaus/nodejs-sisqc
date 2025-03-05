const mongoose = require('mongoose');
const goodsSchema = new mongoose.Schema({
  sku_code: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  photo_url: {
    type: String
  }
}, {
  timestamps: true
});

const Goods = mongoose.model('Goods', goodsSchema);

module.exports = Goods;
