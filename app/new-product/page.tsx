'use client';

import { Suspense } from "react";
import NewArticleComponent from "./component";

export default function Page(){
    return (
        <Suspense>
            <NewArticleComponent></NewArticleComponent>
        </Suspense>
    );
}