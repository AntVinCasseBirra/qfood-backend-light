import { Suspense } from "react";
import NewStationComponent from "./component";

export default function Page(){
    return (
        <Suspense>
            <NewStationComponent></NewStationComponent>
        </Suspense>
    );
}