"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useState } from "react"

import { SafeListing } from "@/types"
import { formatPrice } from "@/lib/utils"

interface ListingCardProps {
    data: SafeListing
}

export default function ListingCard({ data }: ListingCardProps) {
    const router = useRouter()
    const [liked, setLiked] = useState(false)

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
                {/* Image Container */}
                <div className="aspect-square w-full relative overflow-hidden rounded-[22px] bg-[#f5f5f7]">
                    <Image
                        fill
                        className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                        src={data.imageSrc || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                        alt={data.title}
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent rounded-b-[22px]" />

                    {/* Heart button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setLiked(p => !p) }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-apple-sm hover:scale-110 transition-transform duration-200"
                    >
                        <Heart
                            size={14}
                            strokeWidth={2}
                            className={liked ? "fill-red-500 text-red-500" : "text-[#1d1d1f]"}
                        />
                    </button>

                    {/* Category pill */}
                    <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                            {data.category}
                        </span>
                    </div>
                </div>

                {/* Text info */}
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
