'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Cookie, Save, RefreshCw, AlertCircle, CheckCircle2, History } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PoliticasPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [policies, setPolicies] = useState({
        privacy: { text: '', updatedAt: '' },
        cookie: { text: '', updatedAt: '' }
    })

    const fetchPolicies = async () => {
        setLoading(true)
        try {
            const response = await api.get('/configuration/policies')
            const data = response.data
            setPolicies({
                privacy: data.privacy_policy,
                cookie: data.cookie_policy
            })
        } catch (error) {
            toast.error('Erro ao carregar políticas')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    const handleSave = async (key: 'privacy_policy' | 'cookie_policy', text: string) => {
        setSaving(true)
        try {
            await api.post('/configuration/upsert', {
                key,
                value: text
            })
            toast.success('Política atualizada com sucesso!')
            fetchPolicies() // Refresh data
        } catch (error) {
            toast.error('Erro ao salvar política')
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-[#004587] dark:text-white tracking-tight leading-none uppercase">
                    Políticas e Privacidade
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Gerencie o conteúdo legal exibido para os alunos no momento da inscrição.
                </p>
            </div>

            <Tabs defaultValue="privacy" className="w-full">
                <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl h-14 mb-8">
                    <TabsTrigger 
                        value="privacy" 
                        className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-[#004587] dark:data-[state=active]:text-white font-bold transition-all"
                    >
                        <Shield className="size-4 mr-2" />
                        Política de Privacidade
                    </TabsTrigger>
                    <TabsTrigger 
                        value="cookie"
                        className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-[#004587] dark:data-[state=active]:text-white font-bold transition-all"
                    >
                        <Cookie className="size-4 mr-2" />
                        Política de Cookies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="privacy">
                    <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
                        <CardHeader className="p-10 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-2xl font-black text-[#004587] dark:text-white">Política de Privacidade</CardTitle>
                                        <Badge variant="outline" className="rounded-lg border-2 border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold px-3 py-1">
                                            Ativo
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-medium text-slate-500 dark:text-slate-400 italic">
                                        Última atualização: {new Date(policies.privacy.updatedAt).toLocaleString('pt-BR')}
                                    </CardDescription>
                                </div>
                                <Shield className="size-12 text-[#f58220]/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-6">
                            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-6 flex gap-4">
                                <AlertCircle className="size-6 text-amber-600 dark:text-amber-400 shrink-0" />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Atenção ao Atualizar</p>
                                    <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                                        Ao salvar uma nova versão, todos os usuários serão obrigados a aceitar os termos novamente em sua próxima inscrição. Certifique-se de que o texto está correto e revisado.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo da Política (Suporta Texto Simples)</label>
                                <Textarea 
                                    className="min-h-[400px] rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-[#004587] focus:ring-opacity-0 transition-all p-8 font-medium leading-relaxed resize-none"
                                    placeholder="Digite o texto da política de privacidade aqui..."
                                    value={policies.privacy.text}
                                    onChange={(e) => setPolicies(prev => ({ ...prev, privacy: { ...prev.privacy, text: e.target.value } }))}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <Button 
                                onClick={() => handleSave('privacy_policy', policies.privacy.text)}
                                disabled={saving}
                                className="h-14 px-10 rounded-2xl bg-[#f58220] hover:bg-[#e67710] text-white font-black uppercase text-xs tracking-[0.15em] shadow-xl shadow-[#f58220]/20 transition-all active:scale-95 gap-3"
                            >
                                {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Salvar e Publicar Nova Versão
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="cookie">
                    <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
                        <CardHeader className="p-10 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-2xl font-black text-[#004587] dark:text-white">Política de Cookies</CardTitle>
                                        <Badge variant="outline" className="rounded-lg border-2 border-amber-500/20 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-bold px-3 py-1">
                                            Compliance LGPD
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-medium text-slate-500 dark:text-slate-400 italic">
                                        Última atualização: {new Date(policies.cookie.updatedAt).toLocaleString('pt-BR')}
                                    </CardDescription>
                                </div>
                                <Cookie className="size-12 text-[#004587]/10" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-6">
                            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-6 flex gap-4">
                                <History className="size-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Rastreamento de Consentimento</p>
                                    <p className="text-xs text-indigo-800 dark:text-indigo-400 leading-relaxed font-medium">
                                        O banner de cookies será exibido automaticamente para novos visitantes ou se esta política for alterada. O sistema separa cookies entre Essenciais, Performance e Marketing.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Detalhada dos Cookies</label>
                                <Textarea 
                                    className="min-h-[400px] rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-[#004587] focus:ring-opacity-0 transition-all p-8 font-medium leading-relaxed resize-none"
                                    placeholder="Digite o texto da política de cookies aqui..."
                                    value={policies.cookie.text}
                                    onChange={(e) => setPolicies(prev => ({ ...prev, cookie: { ...prev.cookie, text: e.target.value } }))}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <Button 
                                onClick={() => handleSave('cookie_policy', policies.cookie.text)}
                                disabled={saving}
                                className="h-14 px-10 rounded-2xl bg-[#004587] hover:bg-[#00386d] text-white font-black uppercase text-xs tracking-[0.15em] shadow-xl shadow-[#004587]/20 transition-all active:scale-95 gap-3"
                            >
                                {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Atualizar Política de Cookies
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
