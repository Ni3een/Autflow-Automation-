import { requireAuth } from "@/lib/auth-utils";
const page= async ()=>{
    await requireAuth();
    return (
        <p>Work flows</p>
    )
}
export default page;
