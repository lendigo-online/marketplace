"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

export function ClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Toaster
                position="top-center"
                gutter={10}
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '14px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                        maxWidth: '380px',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        },
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#f0fdf4',
                        },
                    },
                    error: {
                        style: {
                            background: '#fff1f2',
                            color: '#9f1239',
                            border: '1px solid #fecdd3',
                        },
                        iconTheme: {
                            primary: '#e11d48',
                            secondary: '#fff1f2',
                        },
                    },
                }}
            />
            {children}
        </SessionProvider>
    )
}
