const mongoose = require('mongoose');

const customerschema = mongoose.Schema({
  	guid : String,	
	first_name: String,
	last_name: String,
	email: String,
	zipcode: String,
	password: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerschema);