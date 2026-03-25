"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FALLBACK = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"

interface ImageGalleryProps {
    images: string[]
    title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const imgs = images.length > 0 ? images : [FALLBACK]
    const [current, setCurrent] = useState(0)
    const [lightbox, setLightbox] = useState(false)

    const prev = () => setCurrent(i => (i - 1 + imgs.length) % imgs.length)
    const next = () => setCurrent(i => (i + 1) % imgs.length)

    return (
        <>
            {/* Main gallery */}
            <div className="w-full relative">
                {/* Main image */}
                <div
                    className="w-full h-[55vh] md:h-[65vh] relative overflow-hidden cursor-zoom-in group"
                    onClick={() => setLightbox(true)}
                >
                    <Image
                        src={imgs[current]}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#fbfbfd] via-transparent to-transparent" />

                    {/* Zoom hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-sm text-white flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium">
                            <ZoomIn size={15} />
                            Powiększ
                        </div>
                    </div>

                    {/* Arrows */}
                    {imgs.length > 1 && (
                        <>
                            <button
                                onClick={e => { e.stopPropagation(); prev() }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); next() }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    {imgs.length > 1 && (
                        <div className="absolute bottom-4 right-4 text-[11px] font-semibold bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {current + 1} / {imgs.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {imgs.length > 1 && (
                    <div className="flex gap-2 mt-3 px-0 overflow-x-auto pb-1">
                        {imgs.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                                    i === current ? "border-[#1d1d1f]" : "border-transparent opacity-60 hover:opacity-90"
                                }`}
                            >
                                <Image src={src} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
                        onClick={() => setLightbox(false)}
                    >
                        {/* Close */}
                        <button
                            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            onClick={() => setLightbox(false)}
                        >
                            <X size={20} />
                        </button>

                        {/* Image */}
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative w-full max-w-4xl h-[80vh] mx-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <Image src={imgs[current]} alt={title} fill className="object-contain" />
                        </motion.div>

                        {/* Arrows */}
                        {imgs.length > 1 && (
                            <>
                                <button
                                    onClick={e => { e.stopPropagation(); prev() }}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); next() }}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronRight size={22} />
                                </button>
                            </>
                        )}

                        {/* Counter */}
                        {imgs.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] font-medium text-white/70">
                                {current + 1} / {imgs.length}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
