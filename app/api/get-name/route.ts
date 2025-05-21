import { NextRequest } from "next/server";

export async function POST(req : NextRequest) {
  try {
    const { name }  = await req.json()
    return Response.json({
        message : `${name} is Success`
    },{
        status : 200,
    })
  } catch (error) {
    console.error("Error sending notifications:", error);
    return Response.json(
      { error },
      { status: 500 }
    );
  }
}