const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt:{
        type: Date,
        expires: 300, // 5 minutes
    }
    
},{
    timestamps: true
})

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema , 'forgot-password')

module.exports = ForgotPassword;