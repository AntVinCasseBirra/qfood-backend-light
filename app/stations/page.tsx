'use client'

import BaseLayout from "@/components/base-layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmQuestion, copy } from "../helper";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { getStations, trashStation } from "../action/stations";

let copyOfDocuments: any[] = [];
export default function Page(){

    const [ isLoading, setIsLoading ] = useState(true);
    const [ documents, setDocuments ] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getStations()
        .then((documents_) => {
            setIsLoading(false);
            copyOfDocuments = copy(documents_ ?? []);
            setDocuments(documents_ ?? []);
        });
    }, []);

    return (
        <BaseLayout breadOne="Piataforma" breadTwo="Stazioni" active="/stations">
            <div className="flex gap-[10px]">
                <Field className="w-full">
                    <InputGroup>
                        <InputGroupInput id="inline-start-input" placeholder="Ricerca..." onChange={(e) => {
                            const copyDocs = copy(copyOfDocuments);
                            const search = e.target.value.trim().toLowerCase();
                            if(search.length == 0){
                                setDocuments(copyDocs);
                            }else{
                                const filtered = copyDocs.filter((c: any) => 
                                    c.title.trim().toLowerCase().includes(search) ||
                                    c._id.trim().toLowerCase().includes(search)
                                );
                                setDocuments(filtered);
                            }
                        }}/>
                        <InputGroupAddon align="inline-start">
                            <SearchIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
                <Button onClick={() => {
                    router.push("/new-station");
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
                                <TableHead>Titolo</TableHead>
                                <TableHead>Posizione</TableHead>
                                <TableHead>Azioni</TableHead>
                                <TableHead>Ultimo aggiornamento</TableHead>
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
                                            {item.position}
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
                                                        delete item.idCompany;
                                                        delete item.createdAt;
                                                        delete item.updatedAt;
                                                        const encodedURI = encodeURIComponent( JSON.stringify(item) );
                                                        router.push(`/new-station?object=${encodedURI}`);
                                                    }}>
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        confirmQuestion(
                                                            {
                                                                confirm: async () => {
                                                                    let isCancelled = await trashStation({idStation: item._id});
                                                                    if(isCancelled){
                                                                        getStations()
                                                                        .then((documents_) => {
                                                                            setDocuments(documents_ ?? []);
                                                                        });
                                                                    }else{
                                                                        toast.error("Errore durante la cancellazione dell'area");
                                                                    }
                                                                },
                                                                cancel: () => {
   
                                                                }
                                                            }
                                                        );
                                                    }}>
                                                        Elimina
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell>{new Date(item.updatedAt + "Z").toLocaleString("it-IT", {timeZone: "Europe/Rome"})}</TableCell>
                                    </TableRow>        
                                )
                            }              
                        </TableBody>
                    </Table>
            }
        </BaseLayout>
    );
}