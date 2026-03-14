'use server';

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getSettings(){

    let document = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/settings/getSettings`,
                {
                    headers: {
                        'Authorization': `Bearer ${bearer}`
                    }
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                document = json.document;
            }
        }

    }catch(e){
        console.log(e);
    }

    return document;
}

export async function storeSettings(
    { fiskalyApiKey, fiskalyApiSecret, cervedKey } : 
    { fiskalyApiKey: string, fiskalyApiSecret: string, cervedKey: string }
){

    let setted = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/settings/storeSettings`,
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${bearer}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            "fiskalyApiKey": fiskalyApiKey,
                            "fiskalyApiSecret": fiskalyApiSecret,
                            "cervedKey": cervedKey
                        }
                    )
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                setted = true;
            }
        }

    }catch(e){
        console.log(e);
    }

    return setted;
}