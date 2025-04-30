
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { UtensilsCrossed, Home, BookOpen, Carrot, CookingPot, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button
import { logoutAction } from '@/app/admin/login/actions'; // Import logout action

export const metadata: Metadata = {
  title: 'Admin Dashboard | FlavorVerse',
  description: 'Manage recipes, ingredients, and seasonings.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-primary">
            <UtensilsCrossed className="h-5 w-5" />
            <span>FlavorVerse Admin</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/recipes" tooltip="Manage Recipes">
                <BookOpen />
                <span>Recipes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/ingredients" tooltip="Manage Ingredients">
                <Carrot />
                <span>Ingredients</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/seasonings" tooltip="Manage Seasonings">
                <CookingPot />
                <span>Seasonings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Add more admin sections here */}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            {/* <SidebarMenuItem>
              <SidebarMenuButton href="/admin/settings" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
             <SidebarMenuItem>
              <SidebarMenuButton href="/" tooltip="Back to Site">
                <Home />
                <span>Back to Site</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Logout Button using a Form */}
             <SidebarMenuItem>
                <form action={logoutAction} className="w-full">
                   {/* Use SidebarMenuButton styling but make it a submit button */}
                    <Button
                      type="submit"
                      variant="ghost" // Use ghost or another appropriate variant
                      className="w-full justify-start gap-2 p-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                      aria-label="Logout"
                    >
                      <LogOut />
                      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </Button>
                </form>
             </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <SidebarTrigger className="sm:hidden" /> {/* Hamburger for mobile */}
           {/* Add breadcrumbs or page title here if needed */}
         </header>
         <main className="flex-1 p-4 sm:px-6 sm:py-0">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
