import { RegisterForm } from "@/features/auth/components/register-form";
import { UnrequireAuth } from "@/lib/auth-utils"
const  Page= async ()=>{
    await UnrequireAuth();
    return (
        <div>
            <RegisterForm/>
        </div>
    )

}
export default Page;