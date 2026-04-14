'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Key, 
    Search, 
    RefreshCcw,
    User,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronDown,
    MoreVertical,
    ClipboardCheck,
    Download
} from 'lucide-react';
import { pdf, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SubscriptionServices from '@/services/subscriptionServices';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    const fetchSubscriptions = async (searchOverride?: string) => {
        setLoading(true);
        try {
            const currentSearch = searchOverride !== undefined ? searchOverride : searchTerm;
            const response = await SubscriptionServices.getAll(currentPage, itemsPerPage, currentSearch);
            // Handle various response formats (items, data, or direct array)
            let subscriptionsList = [];
            if (response.items && Array.isArray(response.items)) {
                subscriptionsList = response.items;
            } else if (response.data && Array.isArray(response.data)) {
                subscriptionsList = response.data;
            } else if (Array.isArray(response)) {
                subscriptionsList = response;
            }
            
            setSubscriptions(subscriptionsList);
            
            if (response.meta) {
                setTotalPages(response.meta.totalPages || 1);
            } else if (Array.isArray(response)) {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Erro ao carregar inscrições", err);
            toast.error("Falha ao carregar inscrições");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [currentPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchSubscriptions();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await SubscriptionServices.update(id, { status });
            toast.success(`Status atualizado para ${status}`);
            fetchSubscriptions();
        } catch (err) {
            toast.error("Erro ao atualizar status");
        }
    };

    const calculateAge = (birthDate?: string | Date) => {
        if (!birthDate) return null;
        const date = new Date(birthDate);
        if (Number.isNaN(date.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age -= 1;
        }
        return age;
    };

    const formatCurrency = (value?: number | string | null) => {
        if (value === null || value === undefined || value === '') {
            return 'R$ 0,00';
        }

        const numberValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (Number.isNaN(numberValue)) {
            return 'R$ 0,00';
        }

        return numberValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });
    };

    const maskCpf = (cpf?: string) => {
        if (!cpf) return 'CPF não informado';
        const clean = cpf.replace(/\D/g, '');
        if (clean.length !== 11) return cpf;
        return `${clean.slice(0, 3)}.***.***-${clean.slice(9)}`;
    };

    const formatDateTime = (value?: string | Date) => {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '—';
        return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const calculatePerCapita = (student?: any) => {
        if (!student) return null;

        const familyIncome = student.family_income ?? student.familyIncome ?? 0;
        const numberParents = student.number_parents_in_home ?? student.numberParentsInHome ?? 0;

        if (!familyIncome || !numberParents) return null;

        const perCapita = Number(familyIncome) / Number(numberParents);
        return Number.isNaN(perCapita) ? null : perCapita;
    };

    const fetchImageAsDataUrl = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            return null;
        }
    };

    const pdfStyles = StyleSheet.create({
        page: {
            padding: 28,
            fontSize: 10,
            fontFamily: 'Helvetica',
            color: '#111827',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 14,
        },
        logo: {
            width: 64,
            height: 64,
            marginRight: 12,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#004587',
        },
        subtitle: {
            fontSize: 10,
            marginTop: 4,
            color: '#4b5563',
        },
        tableHeader: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#004587',
            backgroundColor: '#004587',
            color: '#ffffff',
            paddingVertical: 6,
            paddingHorizontal: 4,
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            borderBottomColor: '#d1d5db',
            paddingVertical: 6,
            paddingHorizontal: 4,
        },
        tableRowAlternate: {
            backgroundColor: '#f8fafc',
        },
        cell: {
            flexGrow: 1,
            flexBasis: 0,
            paddingRight: 4,
            fontSize: 9,
        },
        statusCell: {
            width: 80,
            fontSize: 9,
        },
        smallCell: {
            width: 70,
            fontSize: 9,
        },
        tableHeaderText: {
            fontSize: 9,
            fontWeight: 'bold',
            color: '#ffffff',
        },
    });

    const SubscriptionsPdfDocument = ({ items, logoDataUrl }: { items: any[]; logoDataUrl: string | null }) => (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                    {logoDataUrl ? <Image src={logoDataUrl} style={pdfStyles.logo} /> : null}
                    <View>
                        <Text style={pdfStyles.title}>Relatório de Inscrições - SENAC</Text>
                        <Text style={pdfStyles.subtitle}>Pendentes e Matrículas Confirmadas</Text>
                        <Text style={pdfStyles.subtitle}>{`Emitido em ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`}</Text>
                    </View>
                </View>

                <View style={pdfStyles.tableHeader}>
                    <Text style={[pdfStyles.cell, pdfStyles.tableHeaderText]}>CPF</Text>
                    <Text style={[pdfStyles.cell, pdfStyles.tableHeaderText]}>Nome</Text>
                    <Text style={[pdfStyles.statusCell, pdfStyles.tableHeaderText]}>Status</Text>
                    <Text style={[pdfStyles.cell, pdfStyles.tableHeaderText]}>Horário de inscrição</Text>
                </View>

                {items.map((item, idx) => (
                    <View
                        key={`${item.id}-${idx}`}
                        style={[
                            pdfStyles.tableRow,
                            idx % 2 === 1 ? pdfStyles.tableRowAlternate : {},
                        ]}
                    >
                        <Text style={pdfStyles.cell}>{maskCpf(item.user?.student?.cpf)}</Text>
                        <Text style={pdfStyles.cell}>{item.user?.name || 'N/A'}</Text>
                        <Text style={pdfStyles.statusCell}>{item.status || 'PENDENTE'}</Text>
                        <Text style={pdfStyles.cell}>{formatDateTime(item.created_at || item.createdAt)}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );

    const exportSubscriptionsPdf = async () => {
        if (subscriptions.length === 0) {
            toast.error('Nenhuma inscrição para exportar.');
            return;
        }

        try {
            const logoUrl = 'https://fabianocage.com.br/senacse/wp-content/uploads/2026/02/logo-negativo-vertical.svg';
            const logoDataUrl = await fetchImageAsDataUrl(logoUrl);

            const filteredSubscriptions = subscriptions.filter((sub) =>
                ['PENDENTE', 'EM_ANALISE', 'CONFIRMADO'].includes(sub.status),
            );

            const documentBlob = await pdf(
                <SubscriptionsPdfDocument items={filteredSubscriptions} logoDataUrl={logoDataUrl} />,
            ).toBlob();

            const url = URL.createObjectURL(documentBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio-inscricoes-senac-${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            toast.success('PDF gerado com sucesso.');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            toast.error('Falha ao exportar o PDF.');
        }
    };

    // Subscriptions are now filtered server-side
    const displaySubscriptions = subscriptions;

    const stats = {
        total: subscriptions.length,
        pending: subscriptions.filter(s => s.status === 'PENDENTE' || s.status === 'EM_ANALISE').length,
        confirmed: subscriptions.filter(s => s.status === 'CONFIRMADO').length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#004587] tracking-tight uppercase">Gestão de Inscrições</h1>
                    <p className="text-slate-500 font-medium italic">Monitore e valide as pretensões de matrícula dos candidatos.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => exportSubscriptionsPdf()}
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 h-11 px-4 text-[#004587] dark:text-white font-bold"
                    >
                        <Download className="size-4" />
                        Exportar PDF
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchSubscriptions()} 
                        disabled={loading}
                        className="rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 h-11 px-4 text-[#004587] dark:text-white font-bold"
                    >
                        <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar Dados
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors duration-500">
                    <div className="size-12 rounded-2xl bg-[#004587]/5 dark:bg-[#004587]/20 flex items-center justify-center text-[#004587] dark:text-blue-400 mb-4 group-hover:bg-[#004587] group-hover:text-white transition-all">
                        <Key className="size-6" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">Inscrições Totais</p>
                    <p className="text-4xl font-black text-[#004587] dark:text-[#f58220] mt-1">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors duration-500">
                    <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <Clock className="size-6" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">Aguardando Análise</p>
                    <p className="text-4xl font-black text-amber-500 dark:text-amber-400 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors duration-500">
                    <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <CheckCircle2 className="size-6" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">Matrículas Confirmadas</p>
                    <p className="text-4xl font-black text-emerald-500 dark:text-emerald-400 mt-1">{stats.confirmed}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[500px] transition-colors duration-500">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30 dark:bg-slate-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <Input 
                            placeholder="Buscar por candidato ou curso..." 
                            className="pl-12 h-14 bg-white dark:bg-slate-800 rounded-3xl border-none shadow-sm font-medium focus:ring-1 focus:ring-[#004587]/20 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white dark:bg-slate-900">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">CPF</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Nome</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800">Horário de Inscrição</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right border-b dark:border-slate-800">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Processando Matrículas...</td>
                                </tr>
                            ) : displaySubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-black text-slate-400 uppercase tracking-widest italic">Nenhuma inscrição registrada</td>
                                </tr>
                            ) : displaySubscriptions.map((sub, idx) => (
                                <motion.tr 
                                    key={sub.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group border-l-4 border-l-transparent hover:border-l-[#f58220]"
                                >
                                    <td className="px-8 py-6 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-[0.12em]">
                                        {maskCpf(sub.user?.student?.cpf)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-[15px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#004587] group-hover:text-white transition-all duration-300">
                                                <User className="size-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-[#004587] dark:group-hover:text-[#f58220] transition-colors">{sub.user?.name || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`rounded-xl px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.15em] border-none shadow-sm ${
                                            sub.status === 'CONFIRMADO' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10' :
                                            sub.status === 'CANCELADO' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 shadow-rose-500/10' :
                                            'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-amber-500/10'
                                        }`}>
                                            {sub.status || 'PENDENTE'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.15em]">
                                        {formatDateTime(sub.created_at || sub.createdAt)}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-[20px] transition-all size-11 hover:bg-white dark:hover:bg-slate-800 border-transparent hover:border-slate-100 dark:hover:border-slate-700 border">
                                                    <MoreVertical className="size-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[28px] p-2 border-none shadow-2xl w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                                                <DropdownMenuItem 
                                                    onClick={() => handleUpdateStatus(sub.id, 'CONFIRMADO')}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-bold"
                                                >
                                                    <ClipboardCheck className="size-4" />
                                                    <span className="uppercase text-[10px] tracking-widest">Confirmar Matrícula</span>
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuItem 
                                                    onClick={() => handleUpdateStatus(sub.id, 'CANCELADO')}
                                                    className="rounded-2xl flex items-center gap-3 p-4 cursor-pointer text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold"
                                                >
                                                    <XCircle className="size-4" />
                                                    <span className="uppercase text-[10px] tracking-widest">Cancelar Inscrição</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(totalPages > 1 || true) && (
                    <div className="flex justify-center mt-8 pb-8">
                        <Pagination>
                            <PaginationContent className="bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all dark:text-white",
                                            currentPage === 1 && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                                
                                {[...Array(totalPages)].map((_, idx) => {
                                    const page = idx + 1;
                                    if (
                                        page === 1 || 
                                        page === totalPages || 
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(page)}
                                                    isActive={currentPage === page}
                                                    className={cn(
                                                        "cursor-pointer rounded-2xl transition-all font-bold",
                                                        currentPage === page 
                                                            ? "bg-[#004587] dark:bg-[#f58220] text-white hover:bg-[#004587] dark:hover:bg-[#f58220] hover:text-white" 
                                                            : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                    )}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (
                                        page === currentPage - 2 || 
                                        page === currentPage + 2
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}
    
                                <PaginationItem>
                                    <PaginationNext 
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all dark:text-white",
                                            currentPage === totalPages && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
