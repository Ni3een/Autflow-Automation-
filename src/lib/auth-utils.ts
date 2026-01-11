import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {auth} from  "./auth"


//requireAuth() protects a page or action by checking if the user is logged in.

export const requireAuth=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })

    if(!session){
        redirect("/login")
    }
    return session;
}

export const UnrequireAuth=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })

    if(session){
        redirect("/")
    }
    return session;
}