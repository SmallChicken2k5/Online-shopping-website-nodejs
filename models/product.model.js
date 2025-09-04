const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    product_category_id: {
        type: String,
        default : ''
    },
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: {
        account_id : String,
        createdAt : {
            type: Date,
            default: Date.now
        }
    },
    slug : {
        type: String,
        slug: 'title',
        unique: true
    },
    deleted:  {
        type: Boolean,
        default: false
    },
    // deletedAt: Date
    deletedBy: {
        account_id : String,
        deletedAt : {
            type: Date,
        }
    }
},{
    timestamps: true
})
const product = mongoose.model('product',productSchema,'products');

module.exports = product;