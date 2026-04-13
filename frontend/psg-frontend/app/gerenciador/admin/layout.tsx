export default function AdminLayout({children} : Readonly<{
  children: React.ReactNode;
}>){
    return(
        <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
            {children}
        </main>
    )
}
