import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

connect();

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId"); 
    const cartproductId = searchParams.get("cartproductId"); 

    if (!cartId || !cartproductId) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart ID and Product ID are required",
        },
        { status: 400 }
      );
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      {
        $pull: { products: { _id: new ObjectId(cartproductId) } }, 
      },
      { new: true } // Return the updated cart document
    );

    if (!updatedCart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Cart product deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "An error occurred while deleting the product.",
      },
      { status: 500 }
    );
  }
}
