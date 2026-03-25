import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-[#fbfbfd] border-t border-black/[0.06] py-12">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="text-[13px] text-[#86868b]">
                        © {new Date().getFullYear()} Lendigo. Wszelkie prawa zastrzeżone.
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 text-[13px] text-[#86868b]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">Kontakt</span>
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
