
import LogoutButton from "@/components/functional/logout-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import usersGlobalStore, { IUsersGlobalSore } from "@/store/users-store";
import { ChartBarStacked, Contact, Grid2x2Plus, List, ListTodo, User2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
function Sidebar({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: (open: boolean) => void }) {
  const router = useRouter();
  const { user } = usersGlobalStore() as IUsersGlobalSore
  const pathname = usePathname();

  const size = 13

  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <Grid2x2Plus size={size} />
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <ChartBarStacked size={size} />
    },
    {
      name: "Items",
      path: "/admin/items",
      icon: <List size={size} />
    },
    {
      name: "Rents History",
      path: "/admin/rents-history",
      icon: <ListTodo size={size} />
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <Contact size={size} />
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <User2Icon size={size} />
    }
  ]

  const userMenuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <Grid2x2Plus size={size} />
    },
    {
      name: "Rents",
      path: "/user/rents",
      icon: <ListTodo size={size} />
    },
    {
      name: "Items",
      path: "/user/items",
      icon: <List size={size} />
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: <User2Icon size={size} />
    }
  ]

  const menuItemsToRender: any = user?.role === "admin" ? adminMenuItems : userMenuItems

  return (
    <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 px-7 mt-10">
          {menuItemsToRender.map((item: any) => (
            <div
              key={item.name}
              className={`px-5 py-3 cursor-pointer flex items-center gap-5 ${pathname === item.path
                ? "bg-gray-100 border border-gray-500 rounded text-primary"
                : ""
                }`}
              onClick={() => {
                router.push(item.path)
                setOpenSidebar(false)
              }}
            >
              {item.icon}
              <span
                className={`text-sm ${pathname === item.path ? "text-primary" : ""
                  }`}
              >
                {item.name}
              </span>
            </div>
          ))}
          < LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar