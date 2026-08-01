import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pb-8 px-4 sm:px-8 mx-auto max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}