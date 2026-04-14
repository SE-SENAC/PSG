'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Settings, ShieldCheck, X, Check, Lock, Info } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface CookieConsentProps {
    isOpen: boolean
    onAccept: (categories: string[]) => void
    policyText: string
}

export function CookieConsent({ isOpen, onAccept, policyText }: CookieConsentProps) {
    const [showSettings, setShowSettings] = useState(false)
    const [categories, setCategories] = useState({
        essential: true,
        performance: false,
        marketing: false,
    })

    const handleAcceptAll = () => {
        onAccept(['essential', 'performance', 'marketing'])
    }

    const handleAcceptSelected = () => {
        const selected = Object.entries(categories)
            .filter(([_, enabled]) => enabled)
            .map(([name]) => name)
        onAccept(selected)
    }

    const handleRejectAll = () => {
        onAccept(['essential']) // Essential cannot be rejected
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-8 pointer-events-none">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] w-full max-w-4xl p-6 sm:p-10 pointer-events-auto overflow-hidden relative"
                    >
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#f58220]/10 p-2.5 rounded-2xl">
                                        <Cookie className="size-6 text-[#f58220]" />
                                    </div>
                                    <h3 className="text-xl font-black text-[#004587] dark:text-white uppercase tracking-tight">Privacidade & Cookies</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {policyText || "Utilizamos cookies para personalizar conteúdo e anúncios, fornecer recursos de mídia social e analisar nosso tráfego. Você pode escolher quais categorias de cookies deseja permitir."}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="h-12 px-6 rounded-2xl border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 gap-2 hover:bg-slate-50"
                                >
                                    <Settings className="size-4" />
                                    Personalizar
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleRejectAll}
                                    className="h-12 px-6 rounded-2xl border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold"
                                >
                                    Rejeitar Opcionais
                                </Button>
                                <Button 
                                    onClick={handleAcceptAll}
                                    className="h-12 px-8 rounded-2xl bg-[#004587] hover:bg-[#00386d] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-[#004587]/20"
                                >
                                    Aceitar Todos
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-[10px] uppercase tracking-widest text-[#004587] dark:text-[#f58220]">Necessários</span>
                                                    <Lock className="size-3 text-slate-400" />
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-medium leading-tight">Essenciais para o funcionamento do portal e segurança.</p>
                                            </div>
                                            <Switch checked={true} disabled />
                                        </div>

                                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-[10px] uppercase tracking-widest text-[#004587] dark:text-[#f58220]">Desempenho</span>
                                                    <Info className="size-3 text-slate-400" />
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-medium leading-tight">Nos ajudam a entender como os visitantes interagem com o site.</p>
                                            </div>
                                            <Switch 
                                                checked={categories.performance} 
                                                onCheckedChange={(bit) => setCategories(prev => ({ ...prev, performance: bit }))} 
                                            />
                                        </div>

                                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-[10px] uppercase tracking-widest text-[#004587] dark:text-[#f58220]">Marketing</span>
                                                    <Info className="size-3 text-slate-400" />
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-medium leading-tight">Usados para exibir anúncios relevantes aos seus interesses.</p>
                                            </div>
                                            <Switch 
                                                checked={categories.marketing} 
                                                onCheckedChange={(bit) => setCategories(prev => ({ ...prev, marketing: bit }))} 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <Button 
                                            onClick={handleAcceptSelected}
                                            className="h-10 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs"
                                        >
                                            Confirmar Seleção
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
