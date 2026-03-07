import {SidebarProvider,Sidebar, SidebarInset} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
const Layout=({children}:{children:React.ReactNode})=>{
    return(
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className="bg-accent/20 dot-grid">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
export default Layout;