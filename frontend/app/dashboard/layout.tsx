import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6 dark:bg-slate-950 lg:h-[60px]">
                    <MobileSidebar />
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
