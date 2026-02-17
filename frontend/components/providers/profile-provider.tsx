
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
    email: string;
    full_name: string;
    semester: number;
    sgpa: number;
    cgpa?: number;
    target_cgpa?: number;
    study_hours?: number;
    role: string;
    is_premium: boolean;
    id: string;
}

interface ProfileContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isGuest: boolean;
    refetch: () => Promise<void>;
    logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const router = useRouter();

    const fetchProfile = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setIsGuest(true);
            setIsLoading(false);
            return;
        }

        try {
            // [CACHE] Check sessionStorage/localStorage? 
            // We consciously decide to rely on network or simple memory cache here.
            // If we want persistent cache across reloads, we can use localStorage.
            // But we must be careful to invalidate it.

            // To ensure we don't show stale "Admin" data to "Student", 
            // we really should fetch fresh data or be very careful.
            // My previous fix clears 'user_profile_cache' on login/logout.
            // So we can check that cache.

            const cached = localStorage.getItem("user_profile_cache");
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    setUser(parsed);
                    // If we have cache, we can opt to NOT fetch, or fetch in background.
                    // Let's fetch in background to update study hours etc.
                    setIsLoading(false);
                    setIsGuest(false);
                } catch (e) {
                    console.error("Cache parse error", e);
                }
            }

            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setIsGuest(false);
                localStorage.setItem("user_profile_cache", JSON.stringify(data));
            } else {
                if (res.status === 401) {
                    // Token expired
                    logout();
                } else {
                    console.error("Failed to fetch profile:", res.status);
                }
            }
        } catch (error) {
            console.error("Profile fetch network error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_profile_cache");
        setUser(null);
        setIsGuest(true);
        router.push("/login"); // Optional: redirect
    };

    useEffect(() => {
        const initializeAuth = async () => {
            // 1. Check for existing session (handles OAuth redirect too)
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const currentToken = localStorage.getItem("token");
                if (currentToken !== session.access_token) {
                    localStorage.setItem("token", session.access_token);
                    // Clear old cache if user changed
                    localStorage.removeItem("user_profile_cache");
                    await fetchProfile();
                    // If we are on login page, redirect to dashboard
                    if (window.location.pathname === '/login' || window.location.pathname === '/') {
                        router.push('/dashboard');
                    }
                } else {
                    // Token matches, just fetch profile if needed
                    fetchProfile();
                }
            } else {
                fetchProfile(); // Will set user to null
            }

            // 2. Set up listener for future changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    const currentToken = localStorage.getItem("token");
                    if (currentToken !== session.access_token) {
                        localStorage.setItem("token", session.access_token);
                        localStorage.removeItem("user_profile_cache");
                        fetchProfile();
                        router.push('/dashboard');
                    }
                } else if (event === 'SIGNED_OUT') {
                    logout();
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        };

        initializeAuth();
    }, []);

    return (
        <ProfileContext.Provider value={{ user, isLoading, isGuest, refetch: fetchProfile, logout }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfileContext() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfileContext must be used within a ProfileProvider");
    }
    return context;
}
