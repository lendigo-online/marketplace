"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function DashboardToast() {
    const params = useSearchParams()

    useEffect(() => {
        if (params.get("promoted") === "1") {
            toast.success("Twoje ogłoszenie zostało wyróżnione!")
            window.history.replaceState({}, "", "/dashboard")
        }
    }, [params])

    return null
}
