import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({success: true});

    //apaga o cookie definido a validade dele pra 0
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });

    return response;
}