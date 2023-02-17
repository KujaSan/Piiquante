const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userData = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
});

userData.plugin(uniqueValidator);
module.exports = mongoose.model('User', userData);