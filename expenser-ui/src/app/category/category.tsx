import { columns } from "@/app/category/column";
import { CreateDialog } from "@/app/create-dialog/create-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetCategoryQuery } from "@/hooks/use-category-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@radix-ui/react-separator";

export default function Category() {
  const { data } = useGetCategoryQuery();
  const isMobile = useIsMobile();

  return (
    <div className="flex w-full flex-col">
      <header
        className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4"
        role="banner"
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
          <Separator
            orientation="vertical"
            className="bg-border w-px mr-2 h-4"
            decorative={true}
          />
          <section className="flex flex-col">
            <h1 className="text-lg font-semibold">Category</h1>
            <p className={`text-sm text-gray-500 ${isMobile ? "sr-only" : ""}`}>
              List of Your Categories
            </p>
          </section>
        </div>
        <div className="sticky top-0 right-2">
          <CreateDialog
            creation="Category"
            title="Create Expense Category"
            description="Provide information regarding expense category."
          />
        </div>
      </header>
      <main className="flex min-h-[calc(100vh-4rem)] w-full justify-center py-4">
        <DataTable columns={columns} data={data ?? []} />
      </main>
    </div>
  );
}
