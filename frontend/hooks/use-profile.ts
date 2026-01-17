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
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setIsGuest(false);
                } else {
                    // Token invalid or expired
                    setIsGuest(true);
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setIsGuest(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return { user, isGuest, loading };
}
