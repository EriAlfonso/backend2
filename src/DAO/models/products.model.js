import mongoose from "mongoose";

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: String,

    description: String,

    price: Number,

    thumbnail: String,

    code: { type: String, unique: true },

    stock: Number,

    category: String,

    status: Boolean,
});

mongoose.set('strictQuery', false)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel
