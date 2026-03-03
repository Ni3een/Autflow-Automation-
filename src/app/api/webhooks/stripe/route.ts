import {type NextRequest,NextResponse} from "next/server"
import {inngest} from "@/inngest/client"
import { sendWorkflowExecutions } from "@/inngest/utils";
export async function POST(req:NextRequest){
    try{
        const url=new URL(req.url);
        const workflowId=url.searchParams.get("workflowId");

        if(!workflowId){
            return NextResponse.json({
                success:false,error:"Missing workflowId in query parameters:workflowId",
             },{status:400
            })
        };
        const body=await req.json();

        const stripeData={
            eventId:body.id,
            eventType:body.type,
            timestamp:body.created,
            livemode:body.livemode,
            raw:body.data?.object,
        }
        // trigger inngest function
        await sendWorkflowExecutions({
            workflowId:workflowId,
            initialData:{
                stripe:stripeData, 
            }
        })
    
   return NextResponse.json(
    {success:true},
    {status:200}
   )
}
    catch(error){
        console.error("Stripe webhook error:",error);
        return NextResponse.json({
            success:false,error:"Failed to process the Stripe webhook event",
            },{status:500
        })
    }
}
