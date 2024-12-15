import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Keep Track, Assess, and Enhance Your Financial Performance
          </p>
        </div>
      </header>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <h1 className="text-4xl font-bold">Welcome to Expenser</h1>
      </div>
    </>
  );
}
