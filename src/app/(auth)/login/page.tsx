import { LoginForm } from "@/features/auth/components/login-form";
import { requireAuth, UnrequireAuth } from "@/lib/auth-utils";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  await UnrequireAuth();  
  return (
    <div>
        <LoginForm />
      </div>
  );
};
export default Page;