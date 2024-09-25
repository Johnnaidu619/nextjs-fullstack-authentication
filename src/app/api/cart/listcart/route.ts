import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cart";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const  userId  = request.nextUrl.searchParams.get('userId');
    
    let cart_products =  await Cart.findOne({ user: userId });
    if (!cart_products) {
      return NextResponse.json(
        {
          success: false,
          message: "No cart found for this user.",
        },
        { status: 404 }
      );
    }
     const modifiedCartProducts = await Promise.all(
       cart_products.products.map(async (cartProduct:any) => {
         const product = await Product.findById(cartProduct.product);
         return {
           ...cartProduct.toObject(), 
           title: product.title, 
           image: product.image, 
         };
       })
     );
    return NextResponse.json({
        success: true,
        data: modifiedCartProducts,
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
