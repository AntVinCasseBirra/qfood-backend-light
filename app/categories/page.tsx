'use client'

import BaseLayout from "@/components/base-layout";
import { useEffect, useState } from "react";
import { getCategories, trashCategory } from "../action/category";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { confirmQuestion, copy } from "../helper";
import { toast } from "sonner";

let copyOfDocuments: any[] = [];
export default function Page(){

    const [ isLoading, setIsLoading ] = useState(true);
    const [ documents, setDocuments ] = useState([]);
    const [ search, setSearch ]: [any, any] = useState("");
    const router = useRouter();

    useEffect(() => {
        getCategories()
        .then((documents_) => {
            setIsLoading(false);
            copyOfDocuments = copy(documents_ ?? []);
            setDocuments(documents_ ?? []);
        });
    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Categorie" active="/categories">
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
                    router.push("/new-category");
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
                                                        router.push(`/new-category?object=${encodedURI}`);
                                                    }}>
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        confirmQuestion(
                                                            {
                                                                confirm: async () => {
                                                                    let isCancelled = await trashCategory({idCategory: item._id});
                                                                    if(isCancelled){
                                                                        getCategories()
                                                                        .then((documents_) => {
                                                                            setDocuments(documents_ ?? []);
                                                                        });
                                                                    }else{
                                                                        toast.error("Errore durante la cancellazione della categoria");
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