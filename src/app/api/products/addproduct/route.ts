import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/products";
connect();

export async function POST(request:NextRequest){
    try{
        console.log("recieved request");
        const reqBody= await request.json();
        const {title,price,image,company,sizes}=reqBody;
        console.log(reqBody);

        //check if title already exists
        const product= await Product.findOne({title});
        if(product){
            return NextResponse.json({error: 'Product title already exists'}, {status: 400});
        }
        
        const newProduct=new Product({title, price, image, company, sizes});
        await newProduct.save();
        return NextResponse.json({message: 'Product created successfully', data: newProduct});
    }
    catch(error){
        console.error(error);
        return new Response(JSON.stringify({error: 'An error occurred while adding product'}), {status: 500})
    }
}