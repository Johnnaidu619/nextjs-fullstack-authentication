import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
     const { productId } = params;
     const product = await Product.findById(productId);

     if (!product) {
       return NextResponse.json(
         {
           success: false,
           message: "Product not found",
         },
         { status: 404 }
       );
     }


    return NextResponse.json({
      success: true,
      data: product,
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
