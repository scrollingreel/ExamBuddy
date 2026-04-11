
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
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
    
    // Prevent duplicate API calls and throttling
    const isFetchingRef = useRef(false);
    const lastFetchTimeRef = useRef(0);
    const initializedRef = useRef(false);

    const fetchProfile = async (showLoading = true, force = false) => {
        const now = Date.now();
        
        // Prevent duplicate consecutive calls and throttle to once every 300 seconds (5 mins) unless forced
        if (isFetchingRef.current || (!force && now - lastFetchTimeRef.current < 300000 && user)) {
            return;
        }

        isFetchingRef.current = true;

        // Only show loading spinner on initial load, not on background refreshes
        if (showLoading && !user) {
            setIsLoading(true);
        }

        try {
            // Always get the fresh token from Supabase's session.
            // This ensures we use a valid, auto-refreshed token instead of
            // a potentially expired one stored manually in localStorage.
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setUser(null);
                setIsGuest(true);
                localStorage.removeItem("token");
                setIsLoading(false);
                return;
            }

            // Always sync localStorage with the latest token
            const token = session.access_token;
            localStorage.setItem("token", token);

            // Check cache for instant UI while we fetch fresh data
            const cached = localStorage.getItem("user_profile_cache");
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    setUser(parsed);
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
                    // Token is truly invalid (e.g. user deleted, session revoked)
                    logout();
                } else {
                    console.error("Failed to fetch profile:", res.status);
                }
            }
        } catch (error) {
            console.error("Profile fetch network error", error);
        } finally {
            lastFetchTimeRef.current = Date.now();
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_profile_cache");
        await supabase.auth.signOut();
        setUser(null);
        setIsGuest(true);
        router.push("/login");
    };

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const initializeAuth = async () => {
            // 1. Check for existing session (handles OAuth redirect too)
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Always sync the token from Supabase's session
                localStorage.setItem("token", session.access_token);
                await fetchProfile();
                // If we are on login page, redirect to dashboard
                if (window.location.pathname === '/login' || window.location.pathname === '/') {
                    router.push('/dashboard');
                }
            } else {
                // No session — clear everything
                localStorage.removeItem("token");
                localStorage.removeItem("user_profile_cache");
                setUser(null);
                setIsGuest(true);
                setIsLoading(false);
            }

            // 2. Set up listener for future changes (token refresh, sign in/out)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'TOKEN_REFRESHED' && session) {
                    // Token was refreshed (e.g. tab regained focus) — just update the token silently
                    localStorage.setItem("token", session.access_token);
                } else if (event === 'SIGNED_IN' && session) {
                    localStorage.setItem("token", session.access_token);
                    // Only fetch if we don't have a user, to prevent tab focus SIGNED_IN events from triggering fetch
                    fetchProfile(false, false);
                    if (window.location.pathname === '/login' || window.location.pathname === '/') {
                        router.push('/dashboard');
                    }
                } else if (event === 'SIGNED_OUT') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_profile_cache");
                    setUser(null);
                    setIsGuest(true);
                    router.push("/login");
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
