const mongoose = require('mongoose');

const comicSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type:String, required: true},
    author: {type:String},
    published: {type:Date},
    price: { type:Number, required: true},
    discount: {type:Number, required: true},
    pages: {type:Number},
    condition: {type:String, required:true}
});

module.exports = mongoose.model('Comic', comicSchema);