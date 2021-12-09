var mongoose = require('mongoose')
var recipeSchema = mongoose.Schema({
    
    dishname: {
        type: String,
      
    },
    quantity: {
        type: String,
      
    },
    price: {
        type: Number,
      
    },
    dishimage: {
        type: String,
    },
    createdAt: {type: Date, default: Date.now}
})
module.exports = mongoose.model('recipe',recipeSchema)

