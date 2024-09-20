import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cart";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { ObjectId } = require("mongodb");
    const reqBody = await request.json();
    const { userId, ProductId, quantity, size } = reqBody;

    const product = await Product.findOne({ _id: new ObjectId(ProductId) });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if the product with the specified size is already in the cart
      const productIndex = cart.products.findIndex(
        (item:any) => item.product.toString() === ProductId && item.size === size
      );

      if (productIndex > -1) {
        // If the product exists in the cart with the same size, update the quantity
        cart.products[productIndex].quantity = quantity;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({ product: ProductId, quantity, size });
      }
    } else {
      // If no cart exists for the user, create a new one
      cart = new Cart({
        user: userId,
        products: [{ product: ProductId, quantity, size }],
        totalPrice: product.price * quantity,
      });
    }

    // Calculate total price
    cart.totalPrice = cart.products.reduce((total:any, item:any) => {
      return total + item.quantity * product.price; // Update price calculation based on quantity
    }, 0);

    // Save the cart
    await cart.save();
    return NextResponse.json({ message: "Cart updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error occurred while updating cart" },
      { status: 500 }
    );
  }
}

