import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export const metadata: Metadata = {
    title: "O nas — Lendigo",
    description: "Poznaj Lendigo — polską platformę wypożyczania peer-to-peer. Naszą misją jest udostępnianie rzeczy zamiast ich kupowania, budując lokalną gospodarkę współdzielenia.",
    alternates: {
        canonical: "https://www.lendigo.online/o-nas",
    },
}

const values = [
    {
        title: "Dostęp zamiast własności",
        description: "Wierzymy, że nie musisz posiadać czegoś, żeby z tego skorzystać. Wiertarka potrzebna raz do roku, kajak na weekend, kamera na wesele — po co kupować, skoro można wypożyczyć od sąsiada?",
    },
    {
        title: "Lokalna społeczność",
        description: "Lendigo łączy ludzi w tym samym mieście i dzielnicy. Każda transakcja to nie tylko oszczędność — to relacja między sąsiadami i wkład w lokalną gospodarkę.",
    },
    {
        title: "Bezpieczeństwo i prostota",
        description: "Płatności przez Stripe, weryfikacja adresów email, przejrzyste warunki — zbudowaliśmy platformę, której możesz zaufać. Żadnych ukrytych opłat, żadnych niespodzianek.",
    },
]

export default function ONasPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            {/* Hero */}
            <section className="bg-white border-b border-black/[0.06] py-16 px-6">
                <div className="max-w-[720px] mx-auto">
                    <h1 className="text-[42px] font-bold tracking-tighter text-[#1d1d1f] mb-4">
                        O Lendigo
                    </h1>
                    <p className="text-[19px] text-[#6e6e73] font-light leading-relaxed">
                        Lendigo to polska platforma wypożyczania peer-to-peer, która umożliwia mieszkańcom polskich miast wypożyczanie i udostępnianie przedmiotów bezpośrednio między sobą — bez pośredników, bez zbędnych formalności.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-[720px] mx-auto px-6 py-16">
                <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-6">Nasza misja</h2>
                <div className="space-y-5 text-[16px] text-[#6e6e73] leading-relaxed font-light">
                    <p>
                        Polska gospodarka posiada miliony przedmiotów, które używane są kilka razy w roku lub wcale. Wiertarki, namioty, deski SUP, aparaty fotograficzne, instrumenty muzyczne — leżą w piwnicach i garażach, podczas gdy ktoś w sąsiedniej ulicy desperacko ich szuka.
                    </p>
                    <p>
                        Lendigo powstało, żeby to zmienić. Tworzymy rynek wymiany, gdzie każdy może zarówno zarabiać na swoich rzeczach, jak i unikać niepotrzebnych zakupów. To lepsze dla portfela, lepsze dla środowiska i lepsze dla społeczności lokalnej.
                    </p>
                    <p>
                        Działamy na terenie całej Polski — z aktywną bazą ogłoszeń w Warszawie, Krakowie, Wrocławiu, Gdańsku, Poznaniu i innych miastach. Nasza platforma obsługuje 10 kategorii przedmiotów, od elektroniki po sprzęt outdoorowy.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="bg-white border-t border-black/[0.06] py-16 px-6">
                <div className="max-w-[900px] mx-auto">
                    <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-10">Nasze wartości</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map(({ title, description }) => (
                            <div key={title} className="bg-[#f5f5f7] rounded-3xl p-6">
                                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">{title}</h3>
                                <p className="text-[14px] text-[#6e6e73] leading-relaxed font-light">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="max-w-[720px] mx-auto px-6 py-16">
                <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-6">Kontakt</h2>
                <p className="text-[16px] text-[#6e6e73] font-light mb-8 leading-relaxed">
                    Masz pytanie, sugestię lub chcesz nawiązać współpracę? Napisz do nas — odpowiadamy w ciągu jednego dnia roboczego.
                </p>
                <div className="space-y-4">
                    <a href="mailto:lendigo00@gmail.com" className="flex items-center gap-3 text-[15px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
                        <Mail size={18} className="text-[#6e6e73]" />
                        lendigo00@gmail.com
                    </a>
                    <a href="tel:+48538191200" className="flex items-center gap-3 text-[15px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
                        <Phone size={18} className="text-[#6e6e73]" />
                        +48 538 191 200
                    </a>
                </div>
                <div className="mt-10 pt-8 border-t border-black/[0.06]">
                    <p className="text-[13px] text-[#6e6e73]">
                        Dokumenty prawne:{" "}
                        <Link href="/warunki" className="text-[#0071e3] hover:underline">Warunki korzystania</Link>
                        {" "}·{" "}
                        <Link href="/polityka" className="text-[#0071e3] hover:underline">Polityka prywatności</Link>
                    </p>
                </div>
            </section>
        </div>
    )
}
