"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase-browser";
import type { AuthState, BrandManager, SessionResponse } from "@/types/auth";
import type { User } from "@supabase/supabase-js";

type AuthContextType = AuthState & {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
  initialSession?: SessionResponse | null;
};

export function AuthProvider({
  children,
  initialSession,
}: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<AuthState>({
    user: initialSession?.user ?? null,
    brandManager: initialSession?.brandManager ?? null,
    isLoading: !initialSession,
    isAuthenticated: !!initialSession?.user,
  });

  const supabase = createClient();

  const fetchBrandManager = useCallback(
    async (userId: string): Promise<BrandManager | null> => {
      const { data, error } = await supabase
        .from("brand_managers")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id as string,
        userId: data.user_id as string,
        brandId: data.brand_id as number | null,
        fullName: data.full_name as string,
        phone: data.phone as string | null,
        status: data.status as BrandManager["status"],
        createdAt: data.created_at as string,
        updatedAt: data.updated_at as string,
      };
    },
    [supabase]
  );

  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const brandManager = await fetchBrandManager(user.id);
      setState({
        user: { id: user.id, email: user.email ?? "" },
        brandManager,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setState({
        user: null,
        brandManager: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, [supabase, fetchBrandManager]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      brandManager: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    // Only fetch session if no initial session provided
    const initSession = async () => {
      if (!initialSession) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (user) {
          const brandManager = await fetchBrandManager(user.id);
          if (!isMounted) return;
          setState({
            user: { id: user.id, email: user.email ?? "" },
            brandManager,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            brandManager: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        const brandManager = await fetchBrandManager(session.user.id);
        if (!isMounted) return;
        setState({
          user: { id: session.user.id, email: session.user.email ?? "" },
          brandManager,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (event === "SIGNED_OUT") {
        setState({
          user: null,
          brandManager: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, initialSession, fetchBrandManager]);

  const value: AuthContextType = {
    ...state,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
