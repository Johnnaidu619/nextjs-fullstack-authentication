import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cart";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const  userId  = request.nextUrl.searchParams.get('userId');
    
    const cart_products =  await Cart.findOne({ user: userId });
    let pro_cart = JSON.parse(JSON.stringify(cart_products));
    for (const [i, car_product] of pro_cart.products.entries()) {
      const tit_products=await Product.findById(car_product.product);
      if (tit_products) {
        pro_cart.products[i] = {
          ...car_product, 
          title: tit_products.title, 
          image: tit_products.image, 
        };
      } else {
        console.log(`Product not found for ID: ${car_product.product}`);
      }
    }
    return NextResponse.json({
      success: true,
      data: pro_cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while fetching products.",
      },
      { status: 500 }
    );
  }
}
