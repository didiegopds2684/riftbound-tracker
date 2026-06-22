import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, nickname: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data as Profile | null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string, name: string, nickname: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;

    const userId = data.user?.id;
    if (!userId) return null; // confirmation required — profile created after email verify

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      name,
      nickname,
      favorite_champion_id: null,
    });
    if (profileError && profileError.code !== '23505') return profileError.message; // ignore duplicate

    // If a session was returned, email confirmation is disabled — onAuthStateChange handles redirect
    return null;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return error?.message ?? null;
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return 'Não autenticado';
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates }, { onConflict: 'id' });
    if (error) return error.message;
    await loadProfile(user.id);
    return null;
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id);
  }

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signUp, signIn, signOut, resetPassword, updateProfile, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
