const mongoose = require('mongoose');
const generate = require('../helpers/generate');
const orderSchema = new mongoose.Schema({
    user_id: String,
    cart_id: String,
    code: {
        type: String,
        unique: true,
        default: 'PG-' + generate.generaterandomString(6) 
    },
    userInfo: {
        fullName: String,
        phone: String,
        address: String
    },
    products: [
        {
            product_id: String,
            quantity: Number,
            price: Number,
            discountPercentage: Number
        }
    ],
    status:{
        type: String,
        default: 'pending'
    }
},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema , 'orders')

module.exports = Order;