import { Header } from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex h-screen w-full items-center justify-center px-4">
        <h1 className="text-4xl font-bold">Welcome to Expenser</h1>
      </div>
    </div>
  );
}
