import DashboardNav from '@/components/dashboard/DashboardNav';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen grid grid-cols-[75px_auto] grid-rows-[60px_auto] w-full">
            <div className="sticky top-0 row-span-full">
                <DashboardNav />
            </div>
            <div className="border-b border-teal-300 p-4 sticky top-0">
                <DashboardHeader />
            </div>
            <div className="p-4">{children}</div>
        </section>
    );
}
