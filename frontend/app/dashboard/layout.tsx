import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { ProfileProvider } from "@/components/providers/profile-provider"; // [NEW]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProfileProvider>
            <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
                <Sidebar />
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <header className="flex h-14 items-center gap-4 border-b bg-white px-6 dark:bg-slate-950 lg:h-[60px]">
                        <MobileSidebar />
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </header>
                    <main className="p-4 md:p-6">{children}</main>
                </div>
            </div>
        </ProfileProvider>
    );
}
