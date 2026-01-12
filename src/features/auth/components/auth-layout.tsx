import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
const AuthLayout=({children}: {children: React.ReactNode})=>{
    return(
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
              <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 self-center font-medium"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Image
                      alt="autoflow logo"
                      src="/logo/autoflow.svg"
                      height={20}
                      width={20}
                      className="size-4"
                    />
                  </div>
                  AutoFlow Inc.
                </Link>
                {children}
                </div>
        </div>
    )
}

export default AuthLayout;