import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {type:String,
        index:true},

    description: String,

    price: Number,

    thumbnail: String,

    code: { type: String, unique: true },

    stock: Number,

    category: {type:String,
        index:true},
        
    status: Boolean,
});


productSchema.plugin(mongoosePaginate)
mongoose.set('strictQuery', false)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel
