import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

  user_id:{
    type:String,
  },
  title: {
    type: String,
    required: [true, "Please provide a title for this cart"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    unique: false,
  },
  image: {
    type: String,
    required: [true, "Please provide an img URL for this cart"],
  },
  company: {
    type: String,
    required: [true, "Please provide a company"],
  },
  sizes: {
    type: Array,
    default: false,
  },
});

const Cart =
  mongoose.models.carts || mongoose.model("carts", cartSchema);

export default Cart;
