"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

export function ClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Toaster
                toastOptions={{
                    style: {
                        borderRadius: '20px',
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            {children}
        </SessionProvider>
    )
}
