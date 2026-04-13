'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { BookOpen, FileText, Activity, Users, TrendingUp, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import CursosServices from '@/services/cursosServices';
import EditalService from '@/services/editalService';
import SubscriptionServices from '@/services/subscriptionServices';
import ResultsServices from '@/services/resultsServices';

export default function Dashboard() {
    const [isMounted, setIsMounted] = useState(false);
    
    const [metrics, setMetrics] = useState({
        cursosTotal: 0,
        cursosAtivos: 0,
        cursosInativos: 0,
        cursosProrrogados: 0,
        cursosFuturos: 0,
        editais: 0,
        inscricoes: 0,
        resultados: 0
    });

    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        setIsMounted(true);

        async function fetchData() {
            try {
                // Fetch counts for all states
                const [totalRes, activeRes, inactiveRes, futureRes, extendedRes, editaisRes, subRes, resRes] = await Promise.all([
                    CursosServices.getAll(1, 1),
                    CursosServices.filteredCourses({ status: 0, page: 1, limit: 1 }),
                    CursosServices.filteredCourses({ status: 1, page: 1, limit: 1 }),
                    CursosServices.filteredCourses({ status: 2, page: 1, limit: 1 }),
                    CursosServices.filteredCourses({ status: 3, page: 1, limit: 1 }),
                    EditalService.findAll(1, 1),
                    SubscriptionServices.getAll(),
                    ResultsServices.findAll(1).catch(()=>null)
                ]);

                setMetrics({
                    cursosTotal: totalRes?.meta?.totalItems || 0,
                    cursosAtivos: activeRes?.meta?.totalItems || 0,
                    cursosInativos: inactiveRes?.meta?.totalItems || 0,
                    cursosFuturos: futureRes?.meta?.totalItems || 0,
                    cursosProrrogados: extendedRes?.meta?.totalItems || 0,
                    editais: editaisRes?.meta?.totalItems || 0,
                    inscricoes: Array.isArray(subRes) ? subRes.length : 0,
                    resultados: resRes?.meta?.totalItems || (Array.isArray(resRes) ? resRes.length : 0)
                });

                // Process chart data grouping subscriptions by month
                const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const stats = Array(12).fill(0).map((_, i) => ({
                    name: months[i],
                    inscrições: 0,
                    aprovações: 0
                }));

                const subscriptionList = Array.isArray(subRes) ? subRes : [];
                subscriptionList.forEach((sub: any) => {
                    const dateRaw = sub.created_at || sub.createAt;
                    if (dateRaw) {
                        const date = new Date(dateRaw);
                        if (!isNaN(date.getTime())) {
                            const month = date.getMonth();
                            stats[month].inscrições += 1;
                            if (sub.status === 'CONFIRMADO' || sub.status === 2 || String(sub.status).toLowerCase().includes('aprov')) {
                                stats[month].aprovações += 1;
                            }
                        }
                    }
                });

                // Show dynamic months (current + last 5)
                const currentMonth = new Date().getMonth();
                const displayStats = [];
                for (let i = 5; i >= 0; i--) {
                    let m = currentMonth - i;
                    if (m < 0) m += 12;
                    displayStats.push(stats[m]);
                }
                
                setChartData(displayStats);

            } catch (err) {
                console.error("Erro ao puxar dados do dashboard", err);
            }
        }

        fetchData();
    }, []);

    const cards = [
        { title: "Cursos Totais", value: metrics.cursosTotal, icon: <BookOpen size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Cursos Ativos", value: metrics.cursosAtivos, icon: <Activity size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Inscrições", value: metrics.inscricoes, icon: <Users size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Editais", value: metrics.editais, icon: <FileText size={20} />, color: "text-orange-600", bg: "bg-orange-50" }
    ];

    if (!isMounted) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 line-clamp-1">Olá, Administrador 👋</h1>
                <p className="text-slate-500">Aqui está o que aconteceu com o PSG hoje.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl ${c.bg} ${c.color} transition-colors group-hover:bg-opacity-80`}>
                                {c.icon}
                            </div>
                            <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={12} className="mr-1" /> +12%
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">{c.title}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{c.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Estatísticas de Inscrições</h2>
                            <p className="text-sm text-slate-500">Volume de inscritos nos últimos 6 meses</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-slate-500">Inscrições</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-xs text-slate-500">Aprovações</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.length ? chartData : [{name: '', inscrições: 0, aprovações: 0}]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} allowDecimals={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="inscrições" name="Inscrições" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                                <Bar dataKey="aprovações" name="Aprovações" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Status dos Cursos</h2>
                    <div className="space-y-6">
                        {[
                            { label: "Ativos", value: metrics.cursosAtivos, color: "bg-emerald-500", total: metrics.cursosTotal },
                            { label: "Inativos", value: metrics.cursosInativos, color: "bg-red-500", total: metrics.cursosTotal },
                            { label: "Futuros", value: metrics.cursosFuturos, color: "bg-amber-500", total: metrics.cursosTotal },
                            { label: "Prorrogados", value: metrics.cursosProrrogados, color: "bg-blue-500", total: metrics.cursosTotal }
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 font-medium">{s.label}</span>
                                    <span className="text-slate-900 font-bold">{s.value}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: metrics.cursosTotal > 0 ? `${(s.value / metrics.cursosTotal) * 100}%` : '0%' }}
                                        className={`h-full ${s.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Resultados Publicados</span>
                                <span className="text-2xl font-black text-slate-900">{metrics.resultados}</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <ClipboardCheck size={24} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}