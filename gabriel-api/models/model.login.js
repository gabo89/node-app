const mongoose = require('mongoose');

const customerschema = mongoose.Schema({
	username: String,
	password: String,
	message: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Login', customerschema);