import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const  userId  = request.nextUrl.searchParams.get('userId');
    
    const cart_products =  await Cart.findOne({ user: userId });
    
    return NextResponse.json({
      success: true,
      data: cart_products,
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
