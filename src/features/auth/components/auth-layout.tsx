import React from "react";
import Link from "next/link";
import Image from "next/image";
const AuthLayout=({children}: {children: React.ReactNode})=>{
    return(
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
              <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                  href="/"
                  className="self-center"
                >
                  <Image
                    alt="Autoflow"
                    src="/logo/autoflowwithoutname.svg"
                    height={138}
                    width={280}
                    className="h-auto w-[280px]"
                    priority
                  />
                </Link>
                {children}
                </div>
        </div>
    )
}

export default AuthLayout;