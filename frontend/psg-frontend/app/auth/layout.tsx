'use client'
import type { Metadata } from "next";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import "@/globals.css"
import marca from "./marca.png"
import { useEffect, useState } from "react";
import { Menu, Facebook, Twitter, Instagram } from "lucide-react";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthServices from "@/services/authServices";
import Auth from "@/components/auth_components";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
    </>
  );
}
