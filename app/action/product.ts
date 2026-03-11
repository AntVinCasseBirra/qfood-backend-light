'use server';

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getArticles(){

    let documents = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/article/listAllArticles`,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${bearer}`
                    }
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                documents = json.documents ?? [];
            }
        }

    }catch(e){
        console.log(e);
    }

    return documents ?? [];
}

export async function createArticle(
    {
        _id, 
        title, 
        shortDescription, 
        longDescription, 
        price, 
        rate, 
        departmentNumber, 
        idCategory, 
        preferred, 
        position, 
        availableOnWebApp, 
        availableOnPos, 
        availableForWaiter
    }
    :
    {
        _id?: string | null,
        title: string, 
        shortDescription: string,
        longDescription: string,
        price: number,
        rate: number,
        departmentNumber: number,
        idCategory: string,
        preferred: boolean,
        position: number,
        availableOnWebApp: boolean,
        availableOnPos: boolean,
        availableForWaiter: boolean
    }
) {
    
    let isCreated = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/article/createOrUpdateArticle`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearer}`
                    },
                    body: JSON.stringify(
                        {
                            "_id": _id,
                            "title": title,
                            "shortDescription": shortDescription,
                            "longDescription": longDescription,
                            "price": price,
                            "rate": rate,
                            "departmentNumber": departmentNumber,
                            "idCategory": idCategory,
                            "preferred": preferred,
                            "position": position,
                            "availableOnWebApp": availableOnWebApp,
                            "availableOnPos": availableOnPos,
                            "availableForWaiter": availableForWaiter
                        }
                    )
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                isCreated = true;
            }
        }

    }catch(e){
        console.log(e);
    }

    return isCreated;
}

export async function trashArticle({idArticle}: {idArticle: string}){

    let trashed = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/article/deleteArticle/${idArticle}`,
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${bearer}`
                    }
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                trashed = true;
            }
        }

    }catch(e){
        console.log(e);
    }

    return trashed;
}