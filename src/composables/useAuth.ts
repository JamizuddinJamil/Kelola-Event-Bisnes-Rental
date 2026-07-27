import { ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const initialized = ref(false)

// Keep session in sync across the whole app (called once from App.vue).
async function initAuth() {
  if (initialized.value) return
  initialized.value = true

  const { data } = await supabase.auth.getSession()
  session.value = data.session
  user.value = data.session?.user ?? null

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user ?? null
  })
}

async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })
  return { data, error }
}

async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}

export function useAuth() {
  return {
    user,
    session,
    initAuth,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
  }
}
