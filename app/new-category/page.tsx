import { Suspense } from "react";
import NewCategoryComponent from "./component";
export default function Page(){
    return (
        <Suspense>
            <NewCategoryComponent></NewCategoryComponent>
        </Suspense>
    );
}