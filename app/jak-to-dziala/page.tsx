import type { Metadata } from "next"
import Link from "next/link"
import { Search, CreditCard, Package, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
    title: "Jak to działa — wypożyczanie przez Lendigo",
    description: "Dowiedz się jak działa Lendigo. Przeglądaj ogłoszenia, rezerwuj i odbieraj przedmioty od osób w Twoim mieście. Prosto, szybko, bezpiecznie.",
    alternates: {
        canonical: "https://www.lendigo.online/jak-to-dziala",
    },
}

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Przeglądaj i znajdź",
        description: "Wyszukaj przedmiot, którego potrzebujesz — elektronikę, narzędzia, rower, samochód lub cokolwiek innego. Filtruj według kategorii, lokalizacji i dostępnych dat. Każde ogłoszenie zawiera zdjęcia, opis, cenę za dzień i miasto.",
    },
    {
        number: "02",
        icon: CreditCard,
        title: "Zarezerwuj i zapłać",
        description: "Wybierz daty wypożyczenia i zarezerwuj przedmiot. Płatność odbywa się bezpiecznie przez Stripe — Lendigo nie przechowuje danych kart płatniczych. Całkowita cena jest widoczna przed potwierdzeniem rezerwacji.",
    },
    {
        number: "03",
        icon: Package,
        title: "Odbierz, użyj i zwróć",
        description: "Po potwierdzeniu rezerwacji skontaktujesz się bezpośrednio z właścicielem przedmiotu, aby ustalić szczegóły odbioru. Po zakończeniu okresu wypożyczenia zwróć przedmiot w stanie nienaruszonym. To wszystko.",
    },
]

const forOwners = [
    "Dodaj ogłoszenie za darmo — zdjęcia, opis, cena i dostępność",
    "Sam ustalasz cenę za dzień i blokujesz terminy, kiedy przedmiot jest niedostępny",
    "Płatności trafiają bezpośrednio na Twoje konto przez Stripe",
    "Zarządzaj rezerwacjami z poziomu swojego dashboardu",
]

export default function JakToDzialaPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            {/* Hero */}
            <section className="bg-white border-b border-black/[0.06] py-16 px-6">
                <div className="max-w-[720px] mx-auto text-center">
                    <h1 className="text-[42px] font-bold tracking-tighter text-[#1d1d1f] mb-4">
                        Jak działa Lendigo?
                    </h1>
                    <p className="text-[19px] text-[#6e6e73] font-light leading-relaxed">
                        Lendigo to platforma peer-to-peer, która łączy osoby chcące wypożyczyć przedmiot z tymi, którzy mają go do udostępnienia. Płać tylko za czas, który faktycznie potrzebujesz.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="max-w-[900px] mx-auto px-6 py-20">
                <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-12 text-center">
                    Wypożycz w 3 krokach
                </h2>
                <div className="space-y-12">
                    {steps.map(({ number, icon: Icon, title, description }) => (
                        <div key={number} className="flex gap-8 items-start">
                            <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-[#00bf63]/10 flex items-center justify-center">
                                    <Icon size={24} className="text-[#00bf63]" />
                                </div>
                                <span className="text-[11px] font-bold text-[#6e6e73] tracking-widest">{number}</span>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-3 tracking-tight">{title}</h3>
                                <p className="text-[16px] text-[#6e6e73] leading-relaxed font-light">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* For owners */}
            <section className="bg-white border-t border-black/[0.06] py-20 px-6">
                <div className="max-w-[720px] mx-auto">
                    <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-4">
                        Masz coś do wypożyczenia?
                    </h2>
                    <p className="text-[17px] text-[#6e6e73] font-light mb-10 leading-relaxed">
                        Zarabiaj na przedmiotach, które stoją bezczynnie. Dodaj ogłoszenie w kilka minut i zacznij odbierać rezerwacje od lokalnej społeczności.
                    </p>
                    <ul className="space-y-4 mb-10">
                        {forOwners.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-[15px] text-[#1d1d1f]">
                                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#00bf63] flex items-center justify-center text-white text-[11px] font-bold">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/listings/create"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] transition-all duration-200"
                    >
                        Dodaj ogłoszenie
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* FAQ teaser */}
            <section className="max-w-[720px] mx-auto px-6 py-16">
                <div className="bg-[#f5f5f7] rounded-3xl p-8 text-center">
                    <h2 className="text-[22px] font-semibold text-[#1d1d1f] mb-3">Masz pytania?</h2>
                    <p className="text-[15px] text-[#6e6e73] mb-6">Sprawdź najczęściej zadawane pytania dotyczące wypożyczeń, płatności i bezpieczeństwa.</p>
                    <Link href="/faq" className="text-[#0071e3] font-semibold hover:underline text-[15px]">
                        Zobacz FAQ →
                    </Link>
                </div>
            </section>
        </div>
    )
}
