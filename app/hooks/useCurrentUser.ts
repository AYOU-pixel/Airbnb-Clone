import { useEffect, useState } from "react";
import { UserType } from "@/app/types/listing";

export function useCurrentUser() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/current-user");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("🔴 Error fetching user:", err);
      }
    }

    fetchUser();
  }, []);

  return { user };
}

