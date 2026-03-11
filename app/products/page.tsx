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
import { getArticles, trashArticle } from "../action/product";

let copyOfDocuments: any[] = [];
export default function Page(){

    const [ isLoading, setIsLoading ] = useState(true);
    const [ documents, setDocuments ] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getArticles()
        .then((documents_) => {
            setIsLoading(false);
            copyOfDocuments = copy(documents_ ?? []);
            setDocuments(documents_ ?? []);
        });
    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Prodotti" active="/products">
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
                    router.push("/new-product");
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
                                <TableHead>Prezzo</TableHead>
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
                                            {item.price.toFixed(2).split(".").join(",")} €
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
                                                        router.push(`/new-product?object=${encodedURI}`);
                                                    }}>
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        confirmQuestion(
                                                            {
                                                                confirm: async () => {
                                                                    let isCancelled = await trashArticle({idArticle: item._id});
                                                                    if(isCancelled){
                                                                        getArticles()
                                                                        .then((documents_) => {
                                                                            setDocuments(documents_ ?? []);
                                                                        });
                                                                    }else{
                                                                        toast.error("Errore durante la cancellazione del prodotto");
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