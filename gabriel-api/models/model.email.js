const mongoose = require('mongoose');

const customerschema = mongoose.Schema({
	email: String,
	message: String,
	tobesent: String,
	sent:String
}, {
    timestamps: true
});

module.exports = mongoose.model('Email', customerschema);