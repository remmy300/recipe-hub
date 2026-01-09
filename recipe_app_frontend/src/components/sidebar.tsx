"use client";
import Link from "next/link";
import {
  Home,
  Settings,
  PlusCircleIcon,
  HeartIcon,
  Info,
  Shield,
} from "lucide-react";
import { RxAvatar } from "react-icons/rx";
import { MdFoodBank } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { logoutUser } from "@/redux/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Menu items - Update URLs to actual routes
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Add",
    url: "/add-recipe",
    icon: PlusCircleIcon,
  },

  {
    title: "Favourite",
    url: "/favourites",
    icon: HeartIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: RxAvatar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

// Footer links
const footerItems = [
  {
    title: "About",
    url: "/about",
    icon: Info,
  },

  {
    title: "Privacy",
    url: "/privacy",
    icon: Shield,
  },
];

const AppSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  const protectedRoutes = [
    "/add-recipe",
    "/favourites",
    "/profile",
    "/settings",
  ];

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-3xl font-bold mb-5 text-[#D2691E]">
            <span>
              <MdFoodBank />
            </span>
            TastyShare
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => {
                        if (protectedRoutes.includes(item.url) && !isAuth) {
                          router.push("/login");
                        } else {
                          router.push(item.url);
                        }
                      }}
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span className="text-lg">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {!isAuth && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm">
                <Link href="/login">
                  <span className="text-lg">Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        {isAuth && (
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={async () => {
                await dispatch(logoutUser()); //clears cookie & redux
                router.push("/login"); // redirect
              }}
            >
              <CiLogout className="h-4 w-4" />
              <span className="text-lg">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* Copyright */}
        <div className="px-3 py-2 text-xs text-muted-foreground">
          © 2025 TastyShare
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
