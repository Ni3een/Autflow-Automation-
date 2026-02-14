import toposort from "toposort";
import type { Connection, Node } from "@prisma/client";

export const topologicalSort=(
    nodes:Node[],
    connections:Connection[],
):Node[]=>{
    if(connections.length===0){
        return nodes;
    }
    
    // create edges array for toposort
    const edges:[string,string][]=connections.map((conn)=>[
        conn.fromNodeID,
        conn.toNodeID,
    ]);
    
    const connectedNodeIds=new Set<string>();
    for(const conn of connections){
        connectedNodeIds.add(conn.fromNodeID);
        connectedNodeIds.add(conn.toNodeID);
    }
    
    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id,node.id]);
        }
    }
    
    // perform topological sort
    let sortedNodeIds:string[];
    try{
        sortedNodeIds=toposort(edges);
        // remove duplicated
        sortedNodeIds=[...new Set(sortedNodeIds)];
    }catch(error){
        if(error instanceof Error && error.message.includes("Cyclic dependency")){
            throw new Error("Cyclic dependency detected in workflow");
        }
        throw error;
    }

    // map sorted Id back to node object
    const nodeMap=new Map(nodes.map((n)=>[n.id,n]));
    return sortedNodeIds.map((id)=>nodeMap.get(id)!).filter(Boolean);
}