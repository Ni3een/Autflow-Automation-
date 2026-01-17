import  { requireAuth } from "@/lib/auth-utils";
interface PageProps{
params:Promise<{executionsId:string}>;
}

const Page=async({params}: PageProps)=>{
    await requireAuth();
    const { executionsId } = await params;
    return <div>Executions ID: {executionsId}</div>;
}
export default Page;