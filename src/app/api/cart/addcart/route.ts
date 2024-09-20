import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart";
connect();

export async function POST(request: NextRequest) {
  try {
    console.log("recieved request");
    const reqBody = await request.json();
    const { user_id,title, price, image, company, sizes } = reqBody;
    console.log(reqBody);

    //check if title already exists
    const cart = await Cart.findOne({ title });
    if (cart) {
      return NextResponse.json(
        { error: "cart title already exists" },
        { status: 400 }
      );
    }

    const newProduct = new Cart({ user_id,title, price, image, company, sizes });
    await newProduct.save();
    return NextResponse.json({
      message: "Product added to cart successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "An error occurred while adding product" }),
      { status: 500 }
    );
  }
}
