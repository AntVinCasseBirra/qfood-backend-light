"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { HamburgerIcon, FileIcon, DatabaseIcon, ChartBarStacked, PersonStandingIcon, SettingsIcon } from "lucide-react";

export function AppSidebar({ active, ...props }: {props?: React.ComponentProps<typeof Sidebar>, active: string}) {

  const data = 
    {
      teams: [
        {
          name: "QFood.it",
          logo: (
            <img src={"/qfood-hat.png"} className="w-[40px]"/>
          ),
          plan: "Enterprise",
        }
      ],
      navMain: [
        {
          title: "Catalogo",
          url: "#",
          icon: (
            <HamburgerIcon/>
          ),
          isActive: true,
          items: [
            {
              title: "Categorie",
              url: "/categories",
              isActive: active == "/categories" || active == "/new-category"
            },
            {
              title: "Prodotti",
              url: "/products",
              isActive: active == "/products" || active == "/new-product"
            },
            // {
            //   title: "Varianti",
            //   url: "#",
            //   isActive: false
            // },
          ],
        },
        {
          title: "Documenti",
          url: "#",
          icon: (
            <FileIcon/>
          ),
          isActive: true,
          items: [
            {
              title: "Scontrini",
              url: "#",
              isActive: false
            },
            {
              title: "Annulli",
              url: "#",
              isActive: false
            },
            {
              title: "Resi",
              url: "#",
              isActive: false
            },
          ],
        },
        {
          title: "Anagrafiche",
          url: "#",
          icon: (
            <DatabaseIcon/>
          ),
          isActive: true,
          items: [
            {
              title: "Clienti",
              url: "#",
              isActive: false
            },
            {
              title: "Operatori",
              url: "#",
              isActive: false
            },
            {
              title: "Pagamenti",
              url: "#",
              isActive: false
            },
            {
              title: "Aree",
              url: "#",
              isActive: false
            },
            {
              title: "Stazioni",
              url: "#",
              isActive: false
            }
          ],
        },
        {
          title: "Utility",
          url: "#",
          icon: (
            <SettingsIcon/>
          ),
          isActive: false,
          items: [
            {
              title: "Esci",
              url: "#",
              isActive: false
            }
          ],
        }
      ],
      projects: [
        {
          name: "Statistiche",
          isActive: active == "/dashboard",
          url: "/dashboard",
          icon: (
            <ChartBarStacked/>
          ),
        },
        {
          name: "Aziende",
          url: "/companies",
          isActive: active == "/companies" || active == "/new-company",
          icon: (
            <PersonStandingIcon/>
          ),
        }
      ],
    };
  return (
    data &&
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
