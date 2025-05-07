'use client'

// app/contexts/app-context.tsx
import { ReactNode, createContext, useContext } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import { fetchInitialUser } from '@/lib/user'
import { useDisputes } from '@/hooks/useDisputes'
import { WalletContextProvider } from '@/contexts/wallet-context'

// App Context の型定義
type AppContextValue = {
    disputes: ReturnType<typeof useDisputes>['disputes']
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({
    initialUser,
    children,
}: {
    initialUser: Awaited<ReturnType<typeof fetchInitialUser>>
    children: ReactNode
}) {
    const { disputes } = useDisputes()

    return (
        <WalletContextProvider>
            <AuthProvider initialUser={initialUser}>
                <CartProvider>
                    <AppContext.Provider value={{ disputes }}>
                        {children}
                    </AppContext.Provider>
                </CartProvider>
            </AuthProvider>
        </WalletContextProvider>
    )
}

export function useAppContext() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider')
    }
    return context
}