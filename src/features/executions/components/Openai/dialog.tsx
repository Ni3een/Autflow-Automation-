"use client"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { z } from "zod"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { watch } from "fs"

const formSchema = z.object({
    variableName:z.string().min(1,{message:"Variable name is required"}).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/,{message:"Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    systemPrompt:z.string().optional(),
    userPrompt:z.string().min(1,{message:"User prompt is required"}),
})
export type OpenaiFormValues=z.infer<typeof formSchema>;
interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: OpenaiFormValues) => void
    defaultValues:Partial<OpenaiFormValues>;
}

export const OpenAiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={},
    
}: Props) => {
    const form = useForm<OpenaiFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues?.variableName || "",
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        }
    })
    useEffect(()=>{
        if(open){
            form.reset({
            variableName: defaultValues?.variableName || "",
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
            })
        }
    },[open,defaultValues,form])
    const watchVariableName=form.watch("variableName") || "myOpenAi"

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>OpenAI Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="myOpenAi" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:{`{{${watchVariableName}.aiRessponse}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                            <FormField
                                control={form.control}
                                name="systemPrompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>System Prompt (Optional)</FormLabel>
                                        <FormControl>
                                           <Textarea
                                           placeholder="You are a helpfull assistant."
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                          Sets the behaviour of the assistant. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="userPrompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Prompt</FormLabel>
                                        <FormControl>
                                           <Textarea
                                           placeholder="Summarize this text:{{json httpResponse.data}}"
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The Prompt to send to the AI.Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        

                        <DialogFooter>
                            <Button className="mt-4"
                            type="submit"
                            >Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}