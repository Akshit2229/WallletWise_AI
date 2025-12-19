import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    session: Session | null
    signUp: (email: string, password: string, name: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string, name: string) => {
        console.log('SignUp attempt:', { email, name })
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        })

        if (error) {
            console.error('SignUp error:', error)
            throw error
        }

        console.log('SignUp response:', { user: data.user, session: data.session })

        // Auto sign in after signup (Supabase does this by default)
        if (data.session) {
            setSession(data.session)
            setUser(data.user)
            console.log('User auto-signed in after signup')
        } else if (data.user && !data.session) {
            console.warn('⚠️ User created but no session - EMAIL CONFIRMATION REQUIRED')
            throw new Error('Please check your email to confirm your account before logging in.')
        }
    }

    const signIn = async (email: string, password: string) => {
        console.log('SignIn attempt:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            console.error('SignIn error:', error)
            throw error
        }

        console.log('SignIn successful:', { user: data.user, session: !!data.session })
        setSession(data.session)
        setUser(data.user)
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        setSession(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            signUp,
            signIn,
            signOut,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
