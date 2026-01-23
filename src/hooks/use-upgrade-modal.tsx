import {TRPCClient, TRPCClientError} from  "@trpc/client"
import {useState} from "react"
import {UpgradeModal} from "@/components/upgrade-model"

export const useUpgradeModal=()=>{
    const [Open,setOpen]=useState(false);

  const handleError=(error:unknown)=>{
    if(error instanceof TRPCClientError){
        if(error.data?.code==="FORBIDDEN"){
            setOpen(true);
            return true;
        }   
  }
 return false;
}

const modal=<UpgradeModal open={Open} onOpenChange={setOpen}/>

return {handleError,modal};
}