"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  payload: any;
};

const AccessControlComponent = ({ payload }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!payload?.staffsAccess) return;

    // Extract the relevant path segment (e.g., 'teachers' from '/dashboard/teachers')
    const pathSegments = pathname.split("/").filter(Boolean);
    const mainPathSegment = pathSegments[1]; // Gets 'teachers' from '/dashboard/teachers'

    // Check if the path segment exists and if user has access
    if (mainPathSegment && !payload.staffsAccess.includes(mainPathSegment)) {
      // Redirect to unauthorized page or dashboard home
      router.replace("/dashboard/unauthorized");
    }
  }, [pathname, payload?.staffsAccess, router]);

  return null; // This is just a control component, doesn't render anything
};

export default AccessControlComponent;
