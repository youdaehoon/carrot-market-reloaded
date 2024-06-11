import { NextRequest } from "next/server";

export async function GET(requset:NextRequest) {
    console.log(requset)
    return Response.json({ok:true})
    
}

export async function POST(requset:NextRequest) {
    const data= await requset.json();
    return Response.json(data)
    
}