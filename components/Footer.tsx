import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-[#fbfbfd] border-t border-black/[0.06] py-12">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[13px] text-[#86868b]">
                        © {new Date().getFullYear()} Lendigo. Wszelkie prawa zastrzeżone.
                    </div>
                    <div className="flex items-center gap-6 text-[13px] text-[#86868b]">
                        <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
                            Warunki korzystania
                        </Link>
                        <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
                            Polityka prywatności
                        </Link>
                        <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
                            Kontakt
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
