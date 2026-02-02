"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

export interface UserProfile {
    full_name: string;
    semester: number;
    sgpa: number;
    role: string;
}

export function useProfile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsGuest(true);
                setLoading(false);
                return;
            }

            // [CACHE] Try to load from cache first for instant UI
            const cached = localStorage.getItem("user_profile_cache");
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    setUser(parsed);
                    setLoading(false); // Show cached immediately
                } catch (e) {
                    console.error("Cache parse error", e);
                }
            }

            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setIsGuest(false);
                    // [CACHE] Update cache
                    localStorage.setItem("user_profile_cache", JSON.stringify(data));
                } else {
                    // Token invalid or expired
                    if (!cached) setIsGuest(true); // Only set guest if no cache, otherwise keep showing cache until hard fail? 
                    // Actually if token is invalid, we should probably logout.
                    // But for now let's replicate original logic:
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_profile_cache");
                        setIsGuest(true);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                if (!cached) setIsGuest(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return { user, isGuest, loading };
}
