"use client";

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
  SidebarTrigger,
} from "@/components/ui/sidebar";

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

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/auth/authThunks";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Add", url: "/add-recipe", icon: PlusCircleIcon },
  { title: "Favourite", url: "/favourites", icon: HeartIcon },
  { title: "Profile", url: "/profile", icon: RxAvatar },
  { title: "Settings", url: "/settings", icon: Settings },
];

const footerItems = [
  { title: "About", url: "/about", icon: Info },
  { title: "Privacy", url: "/privacy", icon: Shield },
];

export default function AppSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  const protectedRoutes = [
    "/add-recipe",
    "/favourites",
    "/profile",
    "/settings",
  ];

  const navigate = (url: string) => {
    if (protectedRoutes.includes(url) && !isAuth) {
      router.push("/login");
    } else {
      router.push(url);
    }
  };

  return (
    <>
      <Sidebar collapsible="offcanvas">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-2xl font-bold text-[#D2691E]">
              <MdFoodBank />
              TastyShare
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => navigate(item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
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
                <SidebarMenuButton onClick={() => navigate(item.url)}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {!isAuth ? (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/login")}>
                  Login
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={async () => {
                    await dispatch(logoutUser());
                    router.push("/login");
                  }}
                >
                  <CiLogout />
                  Log Out
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>

          <div className="px-3 py-2 text-xs text-muted-foreground">
            © 2025 TastyShare
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
