"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { useState } from "react"

import { SafeListing } from "@/types"
import { formatPrice } from "@/lib/utils"

interface ListingCardProps {
    data: SafeListing
    horizontal?: boolean
    isLoggedIn?: boolean
    initialLiked?: boolean
}

export default function ListingCard({ data, horizontal, isLoggedIn, initialLiked }: ListingCardProps) {
    const router = useRouter()
    const [liked, setLiked] = useState(initialLiked ?? false)
    const [loading, setLoading] = useState(false)

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isLoggedIn) {
            router.push("/login")
            return
        }
        if (loading) return
        setLoading(true)
        const prev = liked
        setLiked(l => !l) // optimistic
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId: data.id })
            })
            if (!res.ok) setLiked(prev) // rollback
        } catch {
            setLiked(prev)
        } finally {
            setLoading(false)
        }
    }

    const heartButton = (size: number, padding: string) => (
        <button
            onClick={handleLike}
            className={`z-10 ${padding} rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-200`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={liked ? "liked" : "unliked"}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Heart
                        size={size}
                        strokeWidth={2}
                        className={liked ? "fill-red-500 text-red-500" : "text-[#1d1d1f]"}
                    />
                </motion.div>
            </AnimatePresence>
        </button>
    )

    if (horizontal) {
        return (
            <motion.div
                onClick={() => router.push(`/listings/${data.id}`)}
                className="col-span-1 cursor-pointer group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <div className="flex flex-row gap-4 w-full bg-white rounded-[18px] shadow-sm border border-[#f0f0f0] overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative w-[140px] shrink-0 bg-[#f5f5f7]">
                        <Image
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            src={data.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                            alt={data.title}
                        />
                        <div className="absolute top-2 right-2">
                            {heartButton(12, "p-1.5")}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-1 py-4 pr-4 min-w-0">
                        <span className="text-[10px] font-semibold text-[#6e6e73] bg-[#f5f5f7] rounded-full px-2 py-0.5 w-fit">
                            {data.category}
                        </span>
                        <div className="font-semibold text-[15px] leading-tight text-[#1d1d1f] truncate tracking-tight mt-0.5">
                            {data.title}
                        </div>
                        <div className="text-[13px] text-[#6e6e73] truncate">
                            {data.location}
                        </div>
                        <div className="flex flex-row items-baseline gap-1 mt-2">
                            <span className="text-[15px] font-semibold text-[#1d1d1f]">
                                {formatPrice(data.pricePerDay)}
                            </span>
                            <span className="text-[12px] text-[#6e6e73] font-normal">/ dzień</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-[22px] bg-[#f5f5f7]">
                    <Image
                        fill
                        className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                        src={data.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                        alt={data.title}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent rounded-b-[22px]" />
                    <div className="absolute top-3 right-3">
                        {heartButton(14, "p-2")}
                    </div>
                    <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                            {data.category}
                        </span>
                    </div>
                </div>
                <div className="px-0.5">
                    <div className="font-semibold text-[14px] leading-tight text-[#1d1d1f] truncate tracking-tight">
                        {data.title}
                    </div>
                    <div className="text-[13px] text-[#6e6e73] mt-0.5 truncate">
                        {data.location}
                    </div>
                    <div className="flex flex-row items-baseline gap-1 mt-2">
                        <span className="text-[14px] font-semibold text-[#1d1d1f]">
                            {formatPrice(data.pricePerDay)}
                        </span>
                        <span className="text-[12px] text-[#6e6e73] font-normal">/ dzień</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
