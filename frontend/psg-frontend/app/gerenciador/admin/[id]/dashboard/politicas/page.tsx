'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, AlertCircle, Settings, Layers, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PoliticasPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [rules, setRules] = useState({
        psg_max_courses: 2,
        psg_allow_same_shift: false
    })

    const fetchRules = async () => {
        setLoading(true)
        try {
            const response = await api.get('/configuration/enrollment-rules')
            setRules(response.data)
        } catch (error) {
            toast.error('Erro ao carregar configurações')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRules()
    }, [])

    const handleSaveRules = async () => {
        setSaving(true)
        try {
            await Promise.all([
                api.post('/configuration/upsert', { key: 'psg_max_courses', value: rules.psg_max_courses.toString() }),
                api.post('/configuration/upsert', { key: 'psg_allow_same_shift', value: rules.psg_allow_same_shift.toString() })
            ])
            toast.success('Regras de inscrição atualizadas!')
            fetchRules()
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
                    Regras de Inscrição
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Gerencie os limites e restrições para as inscrições do PSG.
                </p>
            </div>

            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
                <CardHeader className="p-10 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black text-[#004587] dark:text-white">Regras do Programa</CardTitle>
                            <CardDescription className="font-medium text-slate-500 dark:text-slate-400">
                                Defina parâmetros globais para o processo de inscrição.
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
                            Estas regras são aplicadas no momento da inscrição. Alterar estas configurações não afetará inscrições já realizadas.
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
                        Salvar Regras do PSG
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
