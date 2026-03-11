'use server';

import { cookies } from "next/headers";
import { encrypt } from "./session";
import { NextResponse } from "next/server";

export async function logIn({email, password}: {email: string, password: string}): Promise<{isLogged: boolean, loginData: any}>{

    let isLogged = false;
    let loginData = null;

    try{

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/auth/logIn`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        { "email": email, "password": password, "noExpirationKey": process.env.API_NO_EXPIRATION_KEY } 
                    )
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.bearer){
                const cookieStore = await cookies();
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                const bearer = await encrypt({"bearer": json.bearer});
                cookieStore.set(
                    'qfoodSession',
                    bearer,
                    {
                        httpOnly: true,
                        secure: true,
                        expires: expiresAt,
                        sameSite: 'lax',
                        path: '/'
                    }   
                );
                loginData = json.data;
                isLogged = true;
            }
        }

    }catch(e){
        console.log(e);
    }

    return { "isLogged": isLogged, "loginData": loginData };
}

export async function logOut(){
    let isLogOut = false;
    try{
        (await cookies()).delete('qfoodSession');
        isLogOut = true;
    }catch(e){
        console.log(e);
    }
    return isLogOut;
}