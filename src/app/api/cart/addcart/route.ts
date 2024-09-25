import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cart";
import Product from "@/models/products";
import User from "@/models/userModel";
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
    let totalproductprice = quantity * product.price;
    if (cart) {
      const productIndex = cart.products.findIndex(
        (item:any) => item.product.toString() === ProductId && item.size === Number(size)
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += Number(quantity);
        cart.products[productIndex].totalproductprice = cart.products[productIndex].quantity*product.price;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({
          product: ProductId,
          quantity,
          size,
          totalproductprice,
        });
      }
    } else {
      // If no cart exists for the user, create a new one
      cart = new Cart({
        user: userId,
        products: [{ product: ProductId, quantity, size, totalproductprice }],
        totalPrice: product.price * quantity,
      });
    }

    cart.products.totalproductprice=cart.products.reduce((total:any,item:any)=>{
      return total+item.quantity*product.price;
    })

    cart.totalPrice = cart.products.reduce((total:any, item:any) => {
      return total + item.quantity * product.price;
    }, 0);

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

export async function PATCH(request: NextRequest) {
  try {
    const { ObjectId } = require("mongodb");
    const reqBody = await request.json();
    const { userId, cartProductId, quantity, size } = reqBody;

    const user =await User.findOne({_id:new ObjectId(userId)});
    if(!user) {
      return NextResponse.json({error:"User not found"},{status:404})
    }
    const cart = await Cart.findOne({ user: userId });
    if(!cart) {
      return NextResponse.json({error:"Cart is empty"},{status:400})
    }
    console.log(cart);
    return NextResponse.json({ message: "Cart updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error occurred while updating cart" },
      { status: 500 }
    );
  }
}

