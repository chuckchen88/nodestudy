var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
	"productId":{type:String},
	"productName":String,
	"salePrice":Number,
	"productImage":String
});

module.exports = mongoose.model("Good",ProductSchema);   //Good  集合名      ProductSchema 格式   

