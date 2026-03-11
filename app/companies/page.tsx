'use client';

import BaseLayout from "@/components/base-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompanies } from "../action/company";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { copy, getDescriptiveModule } from "../helper";

let copyOfDocuments: any = [];
export default function Page() {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ documents, setDocuments ] = useState([]);
    const [ search, setSearch ]: [any, any] = useState("");
    const router = useRouter();

    useEffect(() => {

        getCompanies()
        .then((documents_) => {
            setIsLoading(false);
            copyOfDocuments = copy(documents_ ?? []);
            setDocuments(documents_ ?? []);
        });

    }, []);

    return (
        <BaseLayout breadOne="Dashboard" breadTwo="Aziende" active="/companies">
            <div className="flex gap-[10px]">
                <Field className="w-full">
                    <InputGroup>
                        <InputGroupInput id="inline-start-input" placeholder="Ricerca..." onChange={(e) => {
                            setSearch(e.target.value);
                        }}/>
                        <InputGroupAddon align="inline-start">
                            <SearchIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
                <Button variant={"outline"} onClick={() => {
                    const copyDocs = copy(copyOfDocuments);
                    if(search.trim().length == 0){
                        setDocuments(copyDocs);
                    }else{
                        const filtered = copyDocs.filter((c: any) => 
                            c.title.trim().toLowerCase().includes(search.trim().toLowerCase()) ||
                            c._id.trim().toLowerCase().includes(search.trim().toLowerCase())
                        );
                        setDocuments(filtered);
                    }
                }}>Ricerca</Button>
                <Button onClick={() => {
                    router.push("/new-company");
                }}>Nuovo</Button>
            </div>
            {
                isLoading ? 
                    <div className="flex items-center gap-[5px] text-sm">
                        <Spinner/>
                        Caricamento...
                    </div>
                :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Codice</TableHead>
                                <TableHead>Azienda</TableHead>
                                <TableHead>Moduli</TableHead>
                                <TableHead>Ruolo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                documents.map((item: any, index) => 
                                    <TableRow key={`document-${item._id}`}>
                                        <TableCell>
                                            {item._id}
                                        </TableCell>
                                        <TableCell>
                                            {item.title}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                getDescriptiveModule((item.activeModules ?? []))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                item.isReseller ? 
                                                    <Badge className={`bg-red-900 flex flex-col items-center justify-center`}>
                                                        Rivenditore
                                                    </Badge>
                                                :
                                                    <Badge className={`bg-green-900 flex flex-col items-center justify-center`}>
                                                        Cliente
                                                    </Badge>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="outline">
                                                    <PlusIcon/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-40" align="start">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => {
                                                        
                                                    }}>
                                                        Accedi
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>        
                                )
                            }              
                        </TableBody>
                    </Table>
            }
        </BaseLayout>
    );
}
