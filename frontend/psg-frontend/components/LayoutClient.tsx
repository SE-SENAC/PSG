'use client'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Facebook, Twitter, Instagram, Sun, Moon } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthServices from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { login, logout } from "@/lib/store/auth/auth";
import { toggleTheme } from "@/lib/store/theme/theme";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const navItems = [
    { title: "Como funciona O PSG ? ", href: "#Como funciona o PSG?", description: "" },
    { title: "Regulamento", href: "#Regulamento", description: "" },
    { title: "Como Se Inscrever?", href: "#Como faço para me inscrever?", description: "" },
    { title: "Como É Feito O Cálculo?", href: "#Como é feito o cálculo?", description: "" }
  ]

  const [isAtTop, setIsAtTop] = useState(true);

  const enderecos: { nome: string, endereco: string, cep: string, telefone: string[], email: string }[] = [{
    nome: "SENAC - ARACAJU",
    endereco: "Ribeiro – São José - Aracaju – SE",
    cep: "49.015-070",
    telefone: ["(79) 3212 1560"],
    email: "comunicacao@se.senac.br"
  },
  {
    nome: "Senac - ITABAIANA",
    endereco: "Rua Quintino Bocaiúva, 925 (ao lado da Energisa) - Serrano",
    cep: "49.503-024",
    telefone: ["(79) 3431-1655", "99815-3337"],
    email: "itabaiana@se.senac.br"
  },
  {
    nome: "Senac - LAGARTO",
    endereco: "Rua Raimunda Reis, 140 (Praça dos Três Poderes – Laudelino Freire)",
    cep: "49.400-000",
    telefone: ["(79) 3631 1545"],
    email: "lagarto@se.senac.br"
  },
  {
    nome: "N.S.Glória",
    endereco: "Rua Manoel Francisco de Andrade, 100 - Silo",
    cep: "49.680-000",
    telefone: ["(79) 3411-4400", "(79) 99867-3337"],
    email: "itabaiana@se.senac.br"
  },
  {
    nome: "TOBIAS BARRETO",
    endereco: "Praça Abelardo Barreto do Rosário, s/n - Tobias Barreto",
    cep: "49.300-000",
    telefone: ["(79) 3541 1715"],
    email: "tobiasbarreto@se.senac.br"
  },
  {
    nome: "PROPRIÁ",
    endereco: "Praça da Bandeira, 430 - Propriá",
    cep: "49.900-000",
    telefone: ["(79) 99655-2708"],
    email: "propria@se.senac.br"
  }
  ]

  const MobileMenu = motion.create(SheetContent);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY < 20;
      if (scrolled !== isAtTop) {
        setIsAtTop(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAtTop]);

  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  localStorage.setItem("user", JSON.stringify(user));

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.className = mode;
    }
  }, [mode]);

  const verifyAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      if (isAuth) {
        localStorage.removeItem("token");
        dispatch(logout());
      }
      return;
    }

    try {
      const response = await AuthServices.isAuthenticated(token);
      if (response) {
        dispatch(login({ user: response, token }));
      }
    } catch (e: any) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        localStorage.removeItem("token");
        dispatch(logout());
      }
      console.error("Auth verification failed:", e);
    }
  }

  useEffect(() => {
    setMounted(true);
    verifyAuth();
  }, [])

  const router = useRouter();

  const handleCleanSession = async () => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      try { await AuthServices.logout(token); } catch (e) { }
    }
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className={`sticky top-0 z-50 p-4 transition-all duration-500 ease-in-out border-b ${isAtTop
          ? "bg-background/20 backdrop-blur-md border-transparent shadow-none"
          : "bg-background/80 backdrop-blur-lg border-border/50 shadow-lg py-2"
          }`}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center transition-colors text-foreground">
            <img
              src="https://www.se.senac.br/wp-content/uploads/2023/11/marca-senac-sergipe-topo-marca-nova.png"
              className={`transition-all duration-300 ${isAtTop ? "w-[185px]" : "w-[150px]"} lg:ml-20 ${mode === 'dark' ? 'brightness-0 invert' : ''}`}
              alt="SENAC"
            />
            <NavigationMenu className="lg:mr-20">
              <NavigationMenuList className="">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                        <Menu className="h-8 w-8" />
                      </Button>
                    </SheetTrigger>
                    <MobileMenu side="left" className="w-[300px] sm:w-[400px] bg-background border-r border-border shadow-2xl">
                      <SheetHeader>
                        <SheetTitle className="text-left ml-4 mb-4">
                          <img src="https://www.se.senac.br/wp-content/uploads/2023/11/marca-senac-sergipe-topo-marca-nova.png" className={`w-32 ${mode === 'dark' ? 'brightness-0 invert' : ''}`} alt="Logo" />
                        </SheetTitle>
                      </SheetHeader>
                      <nav className="flex flex-col gap-4 mt-8 ml-4">
                        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTheme())} className="self-start">
                          {mode === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                        </Button>
                        <Link href="/" className="text-lg font-medium hover:text-orange-500 transition-colors">Início</Link>
                        <Link href="/cursos" className="text-lg font-medium hover:text-orange-500 transition-colors">Cursos Disponíveis</Link>
                        <Link href="/diretrizes.pdf" className="text-lg font-medium hover:text-orange-500 transition-colors" target="_blank" rel="noopener noreferrer" download>Diretrizes</Link>
                        <Link href="/resultados" className="text-lg font-medium hover:text-orange-500 transition-colors">Resultados</Link>
                        <Link href="/edital" className="text-lg font-medium hover:text-orange-500 transition-colors">Edital</Link>
                        {mounted && (
                          <>
                            {isAuth ?
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar>
                                      <AvatarImage src="" alt={user?.email || "User"} />
                                      <AvatarFallback className="font-bold bg-[#FF9200] text-white">
                                        {user?.email ? user?.email.charAt(0).toUpperCase() : 'asd'}
                                      </AvatarFallback>
                                    </Avatar>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-32">
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => router.push(`/auth/profile/me`)} className="cursor-pointer">Perfil</DropdownMenuItem>
                                  </DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => handleCleanSession()} className="text-red-600">Sair</DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu> :
                              <Button variant="link" onClick={() => router.push("/auth/login")} className="text-sm hover:text-orange-500 transition-colors ">Entrar</Button>}
                          </>
                        )}
                      </nav>
                    </MobileMenu>
                  </Sheet>
                </div>
                <div className="hidden lg:flex">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link className="drop-shadow-lg" href="/">Início</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="drop-shadow-lg">Sobre o PSG</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {navItems.map((comp, key) =>
                          <NavigationMenuLink href={comp.href} key={key} asChild>
                            <Link href={pathname !== "/" ? "/" : comp.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm font-medium">
                              {comp.title}
                            </Link>
                          </NavigationMenuLink>
                        )}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link className="drop-shadow-lg hover:text-orange-500" href="/cursos">Cursos Disponíveis </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/diretrizes.pdf" className="text-lg font-medium hover:text-orange-500 transition-colors" target="_blank" rel="noopener noreferrer" download>Diretrizes</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link className="drop-shadow-lg hover:text-orange-500" href="/resultados">Resultados</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link className="drop-shadow-lg hover:text-orange-500" href="/edital">Edital</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTheme())} className="hover:text-orange-500 transition-colors">
                      {mode === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      {mounted && (
                        <div>
                          {isAuth ? <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar>
                                  <AvatarImage className="" src="" alt={user?.name || "User"} />
                                  <AvatarFallback className="font-bold bg-[#FF9200] text-white">
                                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-32">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => router.push(`/auth/profile/${user.id}`)} className="cursor-pointer">Perfil</DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleCleanSession()} className="text-red-600 cursor-pointer">Sair</DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu> : <Button variant="link" onClick={() => router.push("/auth/login")} className="text-sm hover:text-orange-500 transition-colors ">Entrar</Button>}
                        </div>
                      )}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
      {children}
      <div className="grid justify-items-center bg-primary text-primary-foreground py-16 border-t border-white/10 mt-auto">
        <div className="pt-5  sm:grid grid-cols-6 gap-y-4 gap-x-36">
          {enderecos.map((a, index) =>
            <div key={index} className="col-span-3 mt-3">
              <div className="text-center sm:text-start">
                <p className="text-2xl font-bold text-secondary">{a.nome}</p>
                <p className="opacity-90">{a.endereco}</p>
                <p className="opacity-90">CEP: {a.cep}</p>
                {a.telefone.map((t, telIndex) => <p key={telIndex} className="opacity-90">{t}</p>)}
                <p className="opacity-90">{a.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col bg-gray-900 text-white md:flex-row items-center justify-center gap-x-32  border-t border-border text-foreground p-8 px-10">
        <div className="text-center md:text-left text-sm max-w-2xl opacity-70">
          <p>SERVIÇO NACIONAL DE APRENDIZAGEM COMERCIAL - DEPARTAMENTO REGIONAL DE SERGIPE. (C) 2018 | NCME | POLÍTICA DE PRIVACIDADE</p>
        </div>
        <div className="flex gap-4 py-4">
          <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/SenacSE/">
            <Facebook className="size-4" />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://x.com/senacsergipe">
            <Twitter className="size-4" />
          </a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/senacse/">
            <Instagram className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
