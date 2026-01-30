import { Loader2Icon, MoreVertical, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { on } from "events";
import Link from "next/link";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {TrashIcon} from "lucide-react";
import { AlertTriangleIcon } from "lucide-react";
import {Card,CardContent,CardHeader,CardTitle,CardDescription} from "./ui/card";
import {DropdownMenuItem, DropdownMenu,DropdownMenuTrigger,DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import {

    Empty,
    EmptyDescription,
    EmptyTitle,
    EmptyHeader,
    EmptyMedia,
    EmptyContent,
} from "./ui/empty";
import { fromJSON } from "postcss";
import React from "react";
type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
    | { onNew: () => void; newButtonHref?: never }
    | { newButtonHref: string; onNew?: never }
    | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({ title, description, newButtonLabel, disabled, isCreating, onNew, newButtonHref }: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-start justify-between gap-x-4">
            <div className="flex flex-col gap-y-1">
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {onNew && !newButtonHref && (
                <Button disabled={isCreating || disabled} onClick={onNew}>
                    <PlusIcon className="size-4 mr-1" />
                    {newButtonLabel}
                </Button>
            )}
            {newButtonHref && !onNew && (
                <Button asChild>
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="size-4 mr-1" />
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
};
type EntityContainerProps = {
    children: React.ReactNode;
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
}
export const EntityContainer=({
    children,
    header,
    search,
    pagination
}:EntityContainerProps)=>{
    return(
        <div className="p-4 md:px-10 md:py-6 h-full">
                <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
                    {header}
        <div className="flex flex-col gap-y-4 h-full">
            {search}
            {children}
            </div>  
            {pagination}      
        </div>
        </div>
    )
}

interface EntitySearchProps{
    value:string;
    onChange:(value:string)=>void;
    placeholder?:string
};
export const EntitySearch=({value,onChange,placeholder}:EntitySearchProps)=>{
    return (
        <div className="flex justify-end">
            <div className="relative w-full max-w-60">
                <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    className="w-full bg-white border border-input rounded-md pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" 
                    placeholder={placeholder}
                    value={value} 
                    onChange={(e)=>onChange(e.target.value)} 
                />
            </div>
        </div>
    )
}
interface EntityPaginationProps{
    page:number;
    totalPages:number;
    onPageChange:(page:number)=>void;
    disabled?:boolean;
}

export const EntityPagination=({
    page,totalPages,onPageChange,disabled
}:EntityPaginationProps)=>{
    return(
        <div className="flex items-center justify-between gap-x-2 w-full">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button disabled={page===1 || disabled}
                    variant="outline" size="sm" onClick={()=>onPageChange(Math.max(1,page-1))}
                >
                    Previous
                </Button>
                <Button  disabled={page===totalPages || totalPages===0 || disabled}
                    variant="outline" size="sm" onClick={()=>onPageChange(Math.min(totalPages,page+1))}>
                    Next
                </Button>

            </div>
        </div>
    )
}
interface StateViewProps{
    message?:string;
};



export const LoadingView=({message}:StateViewProps)=>{
    return(
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
            {!!message &&(
            <p className="text-sm text-muted-foreground">
                {message}
            </p>
            )}

        </div>
    )
}
interface ErrorViewProps{
    message?:string;
};



export const ErrorView=({message}:StateViewProps)=>{
    return(
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon className="text-red-500 hover:text-red-600 size-8 animate-spin" />
            {!!message &&(
            <p className="text-sm text-muted-foreground">
                {message}
            </p>
            )}

        </div>
    )
}
interface EmptyViewProps extends StateViewProps{
    onNew?:()=>void;
    description?:string;
}
export const EmptyView=({message,onNew,description}:EmptyViewProps)=>{
    return (
        <Empty className="border rounded-lg bg-white py-16 px-8">
            <EmptyHeader className="flex flex-col items-center gap-y-4">
                <EmptyMedia variant="icon">
                    <PackageOpenIcon className="size-10 text-muted-foreground" />
                </EmptyMedia>
                <div className="flex flex-col items-center gap-y-2 text-center">
                    <EmptyTitle className="text-lg font-medium text-foreground">
                        {message || "No items"}
                    </EmptyTitle>
                    {description && (
                        <EmptyDescription className="text-sm text-muted-foreground max-w-xs">
                            {description}
                        </EmptyDescription>
                    )}
                </div>
            </EmptyHeader>
            {!!onNew && (
                <EmptyContent className="mt-6">
                    <Button onClick={onNew}>Add item</Button>
                </EmptyContent>
            )}
        </Empty>
    )
}

interface EntityListProps<T>{
    items:T[];
    renderItem:(item:T,index:number)=>React.ReactNode;
    getKey?:(item:T,index:number)=>string|number;
    emptyView?:React.ReactNode;
    className?:string; 
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className
}:EntityListProps<T>){
    if(items.length===0 && emptyView){
        return(
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-sm mx-auto">{emptyView}</div>
            </div>
        )
    }
    return(
        <div className={cn("flex flex-col gap-y-4")}>
            {items.map((item,index)=>(
                <div key={getKey ? getKey(item,index) : index}>
                    {renderItem(item,index)}
                </div>
            ))}
            
        </div>
    )
}
interface EntityItemsProps{
    href:string;
    title:string;
    subtitle?:React.ReactNode;
    image?:React.ReactNode;
    actions?:React.ReactNode;
    onRemove?:()=>void | Promise<void>;
    isRemoving?:boolean;
    className?:string;
}
export const EntityItem=({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className
}:EntityItemsProps)=>{
    const handleRemove=async(e:React.MouseEvent)=>{
        e.stopPropagation();
        e.preventDefault();
        if(isRemoving){
            return;
        }
        if(onRemove){
            await onRemove();
        }
    }
    return(
        <Link href={href} prefetch>
        <Card className={cn("p-4 shadow-none hover:shadow cursor-pointer",isRemoving &&
            "opacity-50 cursore-not-allowed",className
        )}>
            <CardContent className="flex flex-row items-center justify-between p-0">
            <div className="flex items-center gap-3">
                {image}
                <div>
                    <CardTitle className="text-base font-medium">
                        {title}
                    </CardTitle>
                    {!!subtitle &&(
                    <CardDescription className="text-sm">
                        {subtitle}
                    </CardDescription>
                    )}
                </div>
            </div>
            {(actions || onRemove) &&(
                <div className="flex gap-x-4 items-center">
                    {actions}
                    {onRemove &&(
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" onClick={(e)=>e.stopPropagation}>

                                    <MoreVerticalIcon className="size-4"/>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                align="end"
                                onClick={(e)=>e.stopPropagation()}
                                >
                                    <DropdownMenuItem onClick={handleRemove}>
                                        <Button className="text-white">Delete</Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )}
            </CardContent>
        </Card>
        </Link>
    )
}

