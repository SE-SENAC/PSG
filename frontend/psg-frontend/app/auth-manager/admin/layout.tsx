export default function AdminLayout({children} : Readonly<{
  children: React.ReactNode;
}>){
    const menuItems = [
        {name : "Dashboard"},{name : "Cursos"},{name : ""}
    ]

    return(
        <main>
            {children}
        </main>
    )

}