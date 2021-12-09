var mongoose = require('mongoose')
var cartSchema = mongoose.Schema({
    whichuser: {
        type: String,
    },
    recipe: {
        type  :Array,
        default:[]
    },
    total:{
        type:Number,
        default:0
    },
    createdAt: {type: Date, default: Date.now}
})
module.exports = mongoose.model('cart',cartSchema)

