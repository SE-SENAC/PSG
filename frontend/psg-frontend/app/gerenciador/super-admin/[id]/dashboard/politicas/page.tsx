'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Cookie, Save, RefreshCw, AlertCircle, CheckCircle2, History, Settings, Layers, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PoliticasPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [policies, setPolicies] = useState({
        privacy: { text: '', updatedAt: '' },
        cookie: { text: '', updatedAt: '' }
    })
    const [rules, setRules] = useState({
        psg_max_courses: 2,
        psg_allow_same_shift: false
    })

    const fetchPolicies = async () => {
        setLoading(true)
        try {
            const [policiesRes, rulesRes] = await Promise.all([
                api.get('/configuration/policies'),
                api.get('/configuration/enrollment-rules')
            ])
            const data = policiesRes.data
            setPolicies({
                privacy: data.privacy_policy,
                cookie: data.cookie_policy
            })
            setRules(rulesRes.data)
        } catch (error) {
            toast.error('Erro ao carregar configurações')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    const handleSave = async (key: string, value: string) => {
        setSaving(true)
        try {
            await api.post('/configuration/upsert', {
                key,
                value: value.toString()
            })
            toast.success('Configuração atualizada com sucesso!')
            fetchPolicies() // Refresh data
        } catch (error) {
            toast.error('Erro ao salvar configuração')
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const handleSaveRules = async () => {
        setSaving(true)
        try {
            await Promise.all([
                api.post('/configuration/upsert', { key: 'psg_max_courses', value: rules.psg_max_courses.toString() }),
                api.post('/configuration/upsert', { key: 'psg_allow_same_shift', value: rules.psg_allow_same_shift.toString() })
            ])
            toast.success('Regras de inscrição atualizadas!')
            fetchPolicies()
        } catch (error) {
            toast.error('Erro ao salvar regras')
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
                    <TabsTrigger 
                        value="rules"
                        className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-[#004587] dark:data-[state=active]:text-white font-bold transition-all"
                    >
                        <Settings className="size-4 mr-2" />
                        Regras de Inscrição
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
                                        <Badge variant="outline" className="rounded-lg border-2 border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold px-3 py-1">
                                            Ativo
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-medium text-slate-500 dark:text-slate-400 italic">
                                        Última atualização: {new Date(policies.cookie.updatedAt).toLocaleString('pt-BR')}
                                    </CardDescription>
                                </div>
                                <Cookie className="size-12 text-[#f58220]/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-6">
                            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-6 flex gap-4">
                                <AlertCircle className="size-6 text-amber-600 dark:text-amber-400 shrink-0" />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Gestão de Consentimento</p>
                                    <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                                        Descreva como o portal utiliza cookies e outras tecnologias de rastreamento para melhorar a experiência do usuário.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo da Política</label>
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
                                className="h-14 px-10 rounded-2xl bg-[#f58220] hover:bg-[#e67710] text-white font-black uppercase text-xs tracking-[0.15em] shadow-xl shadow-[#f58220]/20 transition-all active:scale-95 gap-3"
                            >
                                {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Salvar e Publicar Nova Versão
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="rules">
                    <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
                        <CardHeader className="p-10 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black text-[#004587] dark:text-white">Regras do Programa</CardTitle>
                                    <CardDescription className="font-medium text-slate-500 dark:text-slate-400">
                                        Defina limites e restrições para as inscrições do PSG.
                                    </CardDescription>
                                </div>
                                <Settings className="size-12 text-[#f58220]/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-10">
                            {/* Max Courses */}
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <Layers className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-base font-bold text-slate-900 dark:text-white">Limite de Cursos por Aluno</Label>
                                        <p className="text-sm text-slate-500 font-medium italic">Quantidade máxima de inscrições permitidas por CPF.</p>
                                    </div>
                                </div>
                                <div className="w-32">
                                    <Input 
                                        type="number" 
                                        min={1} 
                                        max={10}
                                        value={rules.psg_max_courses}
                                        onChange={(e) => setRules(prev => ({ ...prev, psg_max_courses: parseInt(e.target.value) }))}
                                        className="h-12 text-center font-bold text-lg rounded-xl border-2 bg-white dark:bg-slate-950"
                                    />
                                </div>
                            </div>

                            {/* Same Shift Rule */}
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-xl bg-[#004587]/10 flex items-center justify-center text-[#004587] dark:text-[#004587]">
                                        <Clock className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-base font-bold text-slate-900 dark:text-white">Permitir Inscrições no Mesmo Turno</Label>
                                        <p className="text-sm text-slate-500 font-medium italic">Se desativado, o aluno não poderá se inscrever em cursos que ocorram no mesmo turno.</p>
                                    </div>
                                </div>
                                <Switch 
                                    checked={rules.psg_allow_same_shift}
                                    onCheckedChange={(val) => setRules(prev => ({ ...prev, psg_allow_same_shift: val }))}
                                />
                            </div>

                            <div className="rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-6 flex gap-4">
                                <AlertCircle className="size-6 text-blue-600 dark:text-blue-400 shrink-0" />
                                <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed font-medium">
                                    Estas regras são aplicadas no momento da inscrição. Alterar estas configurações não afetará inscrições já realizadas, apenas as futuras.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <Button 
                                onClick={handleSaveRules}
                                disabled={saving}
                                className="h-14 px-10 rounded-2xl bg-[#004587] hover:bg-[#00386d] text-white font-black uppercase text-xs tracking-[0.15em] shadow-xl shadow-[#004587]/20 transition-all active:scale-95 gap-3"
                            >
                                {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Salvar Configurações do PSG
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
