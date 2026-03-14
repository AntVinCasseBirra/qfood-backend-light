'use client'

import { Suspense } from "react"
import NewPaymentComponent from "./component";

export default function Page(){
    return (
        <Suspense>
            <NewPaymentComponent></NewPaymentComponent>
        </Suspense>
    );
}