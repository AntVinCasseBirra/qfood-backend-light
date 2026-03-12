import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./app/action/session";

export default async function proxy(request: NextRequest){
    
    const path = request.nextUrl.pathname;
    if(path.startsWith("/_next/") || path.endsWith("/logo.png")){
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    if(cookieStore.has('qfoodSession') && cookieStore.get('qfoodSession')!.value){

        // Check value
        const cookieValue = cookieStore.get('qfoodSession')!.value;
        const decodedValue = await decrypt(cookieValue);
        if(!decodedValue || (decodedValue && !decodedValue.bearer)){
            cookieStore.delete('qfoodSession');
            return NextResponse.redirect( new URL("/", request.url) );
        }

        // Renew
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        const bearer = await encrypt({"bearer": decodedValue.bearer});

        // If is a protected route, check availability
        const path = request.nextUrl.pathname;
        if(['/companies', '/new-company'].includes(path)){
            let isSuper = false;
            try{
                const response = 
                    await fetch(
                        `${process.env.API_ENDPOINT}/api/v1/security/isSuperAdminOrReseller`,
                        {
                            method: "GET",
                            headers: {
                                'Authorization': `Bearer ${decodedValue.bearer}`
                            }
                        }
                    );
                if(response.status == 200){
                    const json = await response.json();
                    if(json && json.isSuper){
                        isSuper = true;
                    }
                }
            }catch(e){
                console.log(e);
            }finally{
                if(!isSuper){
                    return NextResponse.redirect( new URL("/", request.url) );
                }
            }
        }

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

        if(path == "/"){
            return NextResponse.redirect( new URL("/dashboard", request.url) );
        }else{
            return NextResponse.next();
        }

    }else{
        if(path != "/"){
            return NextResponse.redirect( new URL("/", request.url) );
        }
    }

}