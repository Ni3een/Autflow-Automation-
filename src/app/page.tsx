import React from "react";
import Prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import {Button} from "@/components/ui/button";
const Page= async ()=>{ 
  const user=await Prisma.user.findMany();
  return (
      <div  className="min-h-screen min-w-screen flex items-center justify-center">
        <Button>{JSON.stringify(user)}</Button>
        </div>
  )
}

export default Page 