import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for this product"],
        unique: true,
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        unique: false,
    },
    image: {
        type: String,
        required: [true, "Please provide an img URL for this product"],
    },
    company: {
        type: String,
        required: [true, "Please provide a company"],
    },
    sizes: {
        type: Array,
        default: false,
    },
})

const Product = mongoose.models.products || mongoose.model("products", productSchema);

export default Product;

