import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request:NextRequest){
    try{
        const products= await Product.find();

        return NextResponse.json({
            success: true,
            data: products,
          });
        
        
        
    }
    catch(error: any){
        return NextResponse.json({
            success: false,
            message: error.message || "An error occurred while fetching products.",
          }, { status: 500 });
    }
}