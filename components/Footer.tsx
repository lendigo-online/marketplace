import Link from "next/link"
import PaintSplat from "./PaintSplat"

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-white border-t border-black/[0.06] py-14">

            {/* Paint splatters */}
            <PaintSplat color="#ffde59" className="absolute -top-16 -left-20 w-[280px] h-[280px] opacity-40 rotate-[-25deg] pointer-events-none" />
            <PaintSplat color="#00bf63" className="absolute -bottom-20 -left-10 w-[320px] h-[320px] opacity-30 rotate-[35deg] pointer-events-none" />
            <PaintSplat color="#0071e3" className="absolute -top-10 left-1/3 w-[200px] h-[200px] opacity-20 rotate-[15deg] pointer-events-none" />
            <PaintSplat color="#ffde59" className="absolute top-0 -right-16 w-[260px] h-[260px] opacity-35 rotate-[10deg] pointer-events-none" />
            <PaintSplat color="#00bf63" className="absolute -bottom-10 right-1/4 w-[180px] h-[180px] opacity-25 rotate-[-20deg] pointer-events-none" />
            <PaintSplat color="#0071e3" className="absolute -bottom-16 -right-12 w-[300px] h-[300px] opacity-20 rotate-[50deg] pointer-events-none" />

            <div className="relative max-w-[1200px] mx-auto px-6">
                {/* Logo + tagline */}
                <div className="mb-10">
                    <div className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] select-none mb-2">
                        Lend<span className="text-[#3a3a3c] font-light">igo</span>
                    </div>
                    <p className="text-[14px] text-[#3a3a3c] font-light">Wypożycz cokolwiek — płać tylko za czas.</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-black/[0.06] pt-8">
                    <div className="text-[13px] text-[#1d1d1f]">
                        © {new Date().getFullYear()} Lendigo. Wszelkie prawa zastrzeżone.
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 text-[13px] text-[#1d1d1f]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#3a3a3c]">Kontakt</span>
                            <a href="tel:+48538191200" className="hover:text-[#1d1d1f] transition-colors">+48 538 191 200</a>
                            <a href="mailto:lendigo00@gmail.com" className="hover:text-[#1d1d1f] transition-colors">lendigo00@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/warunki" className="hover:text-[#1d1d1f] transition-colors">
                                Warunki korzystania
                            </Link>
                            <Link href="/polityka" className="hover:text-[#1d1d1f] transition-colors">
                                Polityka prywatności
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
