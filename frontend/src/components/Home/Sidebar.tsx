import { Link } from "react-router-dom";
import Logo from "../Logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuSubButton,
} from "../ui/sidebar";
import {
  EllipsisIcon,
  HomeIcon,
  LockIcon,
  LogOut,
  SettingsIcon,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LogoutDialog from "../dialog/LogoutDialog";
import { useAuth } from "../../context/AuthProvider";
const SideBar = ({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
}) => {
  const { user } = useAuth();
  const navLinks = [
    {
      title: "Home",
      icon: HomeIcon,
      to: "/",
    },
    {
      title: "Sessions",
      icon: LockIcon,
      to: "/sessions",
    },
    {
      title: "Account",
      icon: User,
      to: "/account",
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      to: "/settings",
    },
  ];
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 font-semibold text-xl">
            <Logo />
            <p>Squeezy</p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {navLinks.map((links, i) => (
            <Link
              to={links.to}
              key={i}
              className="flex items-center gap-1 ml-2 mt-3"
            >
              <links.icon />
              <p>{links.title}</p>
            </Link>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarFallback className="rounded-full border border-gray-500">
                    {user?.name?.split(" ")?.[0]?.charAt(0)}
                    {user?.name?.split(" ")?.[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <EllipsisIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={"bottom"}
              align="start"
              sideOffset={4}
            >
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex items-center gap-2 justify-start cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </SidebarProvider>
  );
};

export default SideBar;
