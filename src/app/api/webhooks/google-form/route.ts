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

        const formData={
            formId:body.formId,
            responses:body.responses,
            formTitle:body.formTitle,
            reponseId:body.reponseId,
            timesstamp:body.timestamp,
            responseEmail:body.responsedentEmail,
            raw:body,
        }
        // trigger inngest function
        await sendWorkflowExecutions({
            workflowId:workflowId,
            intialData:{
                googleForm:formData, 
            }
        })
    }
    catch(error){
        console.error("Google form webhook error:",error);
        return NextResponse.json({
            success:false,error:"Failed to process the Google Form submission",
            },{status:500
        })
    }
}
