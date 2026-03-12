'use client';

import { toast } from "sonner";
import CryptoJS from 'crypto-js';

const localKeyEncrypt = "zDVInEOQP7WcHGs6qnFqEpnDB4fzmffQGaxG0f4uSPSKqbmw";

export function now(){
    return new Date().getTime();
}

export function getDescriptiveModule(modules: string[]): string{
    if(modules.length == 0){
        return "Nessun modulo";
    }
    let formattedModules: string[] = [];
    modules.forEach(m => {
        switch(m){
            case "waiter": {
                formattedModules.push("Cameriere");
            } break;
            case "self_order": {
                formattedModules.push("Ordine al tavolo");
            } break;
            case "digital_menu": {
                formattedModules.push("Menù digitale");
            } break;
            case "aruba": {
                formattedModules.push("Aruba");
            } break;
        }
    });
    return formattedModules.join(", ");
}

export function copy(toCopy: any): any{
    return JSON.parse(JSON.stringify(toCopy));
}

export function confirmQuestion({confirm, cancel}: {confirm: any, cancel: any}){
    toast(
        "Sicuro di voler procedere? L'operazione è irreversibile!",
        {
            dismissible: true,
            position: "top-center",            
            duration: 10000000,
            action: {
                label: "Conferma",
                onClick: () => {
                    confirm();
                }
            },
            cancel: {
                label: "Annulla",
                onClick: () => {
                   cancel();
                }
            }
        }
    );
}

export function encrypt(text: string){
    return CryptoJS.AES.encrypt(
        text,
        localKeyEncrypt
    ).toString();
}

export function decrypt(enc: string){
    const bytes = CryptoJS.AES.decrypt(enc, localKeyEncrypt);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
}