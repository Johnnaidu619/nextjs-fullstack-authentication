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

    let cart = await Cart.findOne({ _id: new ObjectId(cartId) });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      {
        $pull: { products: { _id: new ObjectId(cartproductId) } },
      },
      { new: true } 
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


    const newTotalPrice = updatedCart.products.reduce(
      (acc: number, item: any) => acc + item.totalproductprice,
      0
    );

    updatedCart.totalPrice = newTotalPrice;
    await updatedCart.save();

    return NextResponse.json(
      {
        message: "Cart product deleted and total price updated",
        cart: updatedCart,
      },
      { status: 200 }
    );
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
