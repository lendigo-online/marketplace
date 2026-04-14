"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarX, MapPin, ExternalLink, ChevronDown, Zap, Percent } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { SafeListing, DiscountRule } from "@/types"
import BlockedDatesEditor from "./BlockedDatesEditor"
import DiscountRulesEditor from "./DiscountRulesEditor"
import PromotionPanel from "./PromotionPanel"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
    listing: SafeListing
    index?: number
}

export default function ListingWithCalendar({ listing, index = 0 }: Props) {
    const [open, setOpen] = useState(false)
    const [openDiscounts, setOpenDiscounts] = useState(false)
    const [openPromotion, setOpenPromotion] = useState(false)

    const isPromoted = listing.promotedUntil && new Date(listing.promotedUntil) > new Date()

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
            layout
            className={`bg-white rounded-[22px] border border-black/[0.04] shadow-apple-sm overflow-hidden ${(open || openDiscounts || openPromotion) ? "lg:col-span-2" : ""}`}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Zdjęcie */}
                <Link
                    href={`/listings/${listing.id}`}
                    className="relative h-44 sm:h-auto sm:w-52 flex-shrink-0 bg-[#f5f5f7] block overflow-hidden"
                >
                    <Image
                        src={listing.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                        fill
                        alt={listing.title}
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                {/* Treść */}
                <div className="flex flex-col flex-1 p-5 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <Link
                                href={`/listings/${listing.id}`}
                                className="font-bold text-[17px] text-[#1d1d1f] hover:underline leading-snug flex items-center gap-1.5 group"
                            >
                                <span className="truncate">{listing.title}</span>
                                <ExternalLink size={13} className="flex-shrink-0 text-[#6e6e73] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <div className="flex items-center gap-1 mt-1.5">
                                <MapPin size={12} className="text-[#6e6e73] flex-shrink-0" />
                                <span className="text-[13px] text-[#6e6e73] truncate">{listing.location}</span>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <span className="text-[10px] font-semibold text-[#6e6e73] bg-[#f5f5f7] rounded-full px-2.5 py-1 uppercase tracking-wide">
                                {listing.category}
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[20px] font-bold text-[#1d1d1f]">{formatPrice(listing.pricePerDay)}</span>
                            <span className="text-[13px] text-[#6e6e73]">/ dzień</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            <motion.button
                                onClick={() => { setOpenDiscounts(v => !v); setOpen(false) }}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.03 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors duration-200 ${
                                    openDiscounts
                                        ? "bg-[#0071e3] text-white border-[#0071e3]"
                                        : "bg-white text-[#1d1d1f] border-[#d2d2d7] hover:border-[#0071e3] hover:text-[#0071e3]"
                                }`}
                            >
                                <Percent size={13} />
                                Rabaty
                                <motion.span
                                    animate={{ rotate: openDiscounts ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex"
                                >
                                    <ChevronDown size={13} />
                                </motion.span>
                            </motion.button>

                            <motion.button
                                onClick={() => { setOpenPromotion(v => !v); setOpen(false); setOpenDiscounts(false) }}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.03 }}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors duration-200 ${
                                    openPromotion
                                        ? "bg-gradient-to-r from-[#ffde59] to-[#ffc800] text-[#1d1d1f] border-[#ffde59]"
                                        : isPromoted
                                            ? "bg-[#fffbea] text-[#a07800] border-[#ffde59]"
                                            : "bg-[#fffbea] text-[#a07800] border-[#ffde59]/50 hover:border-[#ffde59]"
                                }`}
                            >
                                <Zap size={13} className={isPromoted ? "fill-[#ffde59] text-[#a07800]" : "text-[#a07800]"} />
                                {isPromoted ? "Wyróżnione" : "Promuj"}
                                <motion.span
                                    animate={{ rotate: openPromotion ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex"
                                >
                                    <ChevronDown size={13} />
                                </motion.span>
                            </motion.button>

                            <motion.button
                                onClick={() => { setOpen(v => !v); setOpenDiscounts(false) }}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.03 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors duration-200 ${
                                    open
                                        ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                                        : "bg-white text-[#1d1d1f] border-[#d2d2d7] hover:border-[#1d1d1f]"
                                }`}
                            >
                                <CalendarX size={14} />
                                Terminarz
                                <motion.span
                                    animate={{ rotate: open ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex"
                                >
                                    <ChevronDown size={13} />
                                </motion.span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Promocja — animowane rozwinięcie */}
            <AnimatePresence>
                {openPromotion && (
                    <motion.div
                        key="promotion"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            exit={{ y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="border-t border-black/[0.06] px-5 pb-5"
                        >
                            <PromotionPanel
                                listingId={listing.id}
                                promotedUntil={listing.promotedUntil ?? null}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rabaty — animowane rozwinięcie */}
            <AnimatePresence>
                {openDiscounts && (
                    <motion.div
                        key="discounts"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            exit={{ y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="border-t border-black/[0.06] px-5 pb-5"
                        >
                            <DiscountRulesEditor
                                listingId={listing.id}
                                initialRules={(listing.discountRules ?? []) as DiscountRule[]}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Terminarz — animowane rozwinięcie */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            exit={{ y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="border-t border-black/[0.06] px-5 pb-5"
                        >
                            <BlockedDatesEditor
                                listingId={listing.id}
                                initialBlockedDates={listing.blockedDates || []}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
