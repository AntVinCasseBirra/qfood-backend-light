import { Suspense } from "react";
import NewAreaComponent from "./component";

export default function Page(){
    return (
        <Suspense>
            <NewAreaComponent></NewAreaComponent>
        </Suspense>
    );
}