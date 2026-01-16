export default function AdminIndexPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
                <p className="text-muted-foreground">
                    Welcome to the admin control panel.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats would go here */}
                <div className="p-6 border rounded-lg shadow-sm">
                    <div className="text-2xl font-bold">Waiting Approval</div>
                    <div className="text-muted-foreground">Check Approvals Tab</div>
                </div>

                <a href="/admin/users" className="block p-6 border rounded-lg shadow-sm hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="text-2xl font-bold text-blue-600">Manage Users</div>
                    <div className="text-muted-foreground">View list & promote to Premium</div>
                </a>
            </div>
        </div>
    )
}
