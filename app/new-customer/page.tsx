import { Suspense } from "react";
import NewCustomerComponent from "./component";

export default function Page(){
    return (
        <Suspense>
            <NewCustomerComponent></NewCustomerComponent>
        </Suspense>
    );
}