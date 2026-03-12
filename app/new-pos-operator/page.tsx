import { Suspense } from "react";
import NewOperatorComponent from "./component";

export default function Page(){
    return (
        <Suspense>
            <NewOperatorComponent></NewOperatorComponent>
        </Suspense>
    );
}