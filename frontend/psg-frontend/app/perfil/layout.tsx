'use client'

import {Sidebar, SidebarProvider,SidebarTrigger,SidebarHeader,SidebarContent ,SidebarGroup, SidebarMenu,SidebarMenuItem,SidebarMenuButton} from "@/components/ui/sidebar";
import React from "react";
import { useState } from "react";

export default function DashboardLayout({children} : Readonly<{
  children: React.ReactNode;
}>){
    
    const sidebar_elems = [
        {title : "Início"}
    ]


    const [hover,setHover] = useState<boolean>(false);

    return(
            <SidebarProvider defaultOpen={false} open={hover}>
                <Sidebar className="h-[25vh] mt-[10vh]" >
                    <SidebarHeader/>
                    <SidebarContent onMouseLeave={()=>setHover(false)}>
                            <SidebarMenu>
                                {sidebar_elems.map((x,index) => <SidebarMenuItem key={index}>
                                    <SidebarMenuButton>
                                        {x.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>)}
                            </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <main className="flex sm:gap-[12.25%]">
                    <SidebarTrigger className="absolute sm:relative" onMouseEnter={()=>setHover(true)}  />
                    {children}
                </main>
            </SidebarProvider>
    )

}