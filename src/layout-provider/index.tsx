"use client"

import { usePathname } from "next/navigation";
import PrivateLayout from "./private-layout";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPrivate = pathname.startsWith("/user") || pathname.startsWith("/admin");
  if (isPrivate) {
    return (
      <PrivateLayout>
        {children}
      </PrivateLayout>
    )
  }

  return (
    <div>{children}</div>
  )
}

export default LayoutProvider