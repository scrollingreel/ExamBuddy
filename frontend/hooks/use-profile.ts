"use client";

import { useProfileContext } from "@/components/providers/profile-provider";

export type { UserProfile } from "@/components/providers/profile-provider";

export function useProfile() {
    const { user, isGuest, isLoading, refetch, logout } = useProfileContext();
    return { user, isGuest, loading: isLoading, refetch, logout };
}
