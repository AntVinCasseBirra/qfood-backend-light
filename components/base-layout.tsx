'use client'

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function BaseLayout({children, breadOne, breadTwo, breadThree, breadTwoAction, active}: {children: React.ReactNode, breadOne: string, breadTwo: string, breadThree?: string, breadTwoAction?: any, active: string}) {
  return (
    typeof window !== undefined &&
    <SidebarProvider className="animate__animated animate__fadeIn animate__faster">
      <AppSidebar active={active}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 block sm:hidden" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto block sm:hidden"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink>
                      {breadOne}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {
                      breadTwoAction ? 
                        <BreadcrumbLink href={breadTwoAction}>{breadTwo}</BreadcrumbLink>
                      :
                        <BreadcrumbPage>{breadTwo}</BreadcrumbPage>
                    }
                  </BreadcrumbItem>
                  {
                    breadThree &&
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{breadThree}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  }
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {/* <div className="pr-[20px]">
              <Button>Esci</Button>
            </div> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
