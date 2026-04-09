import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "FAQ — Często zadawane pytania",
    description: "Odpowiedzi na najczęstsze pytania o Lendigo: jak wypożyczyć przedmiot, jak działa płatność, co z ubezpieczeniem, jak dodać ogłoszenie i jak skontaktować się z właścicielem.",
    alternates: {
        canonical: "https://www.lendigo.online/faq",
    },
}

const faqs = [
    {
        category: "Wypożyczanie",
        items: [
            {
                question: "Jak wypożyczyć przedmiot przez Lendigo?",
                answer: "Znajdź przedmiot na stronie głównej lub użyj wyszukiwarki. Wybierz daty, sprawdź dostępność w kalendarzu i dokonaj płatności przez Stripe. Po potwierdzeniu rezerwacji właściciel skontaktuje się z Tobą, aby umówić odbiór.",
            },
            {
                question: "Czy mogę wypożyczyć przedmiot na jeden dzień?",
                answer: "Tak. Minimalna długość wypożyczenia to 1 dzień. Ceny w ogłoszeniach podawane są w złotych polskich za dobę (PLN/dzień). Łączna kwota obliczana jest automatycznie po wybraniu dat.",
            },
            {
                question: "Jak odbieram i zwracam wypożyczony przedmiot?",
                answer: "Po dokonaniu rezerwacji otrzymasz dane kontaktowe właściciela. Szczegóły odbioru — miejsce, godzina — ustalacie bezpośrednio między sobą. Zwrot odbywa się analogicznie, po zakończeniu okresu wypożyczenia.",
            },
            {
                question: "Co zrobić, jeśli właściciel nie odpowiada?",
                answer: "Jeśli właściciel nie odpowie w ciągu 24 godzin od potwierdzenia rezerwacji, skontaktuj się z nami pod adresem lendigo00@gmail.com lub telefonicznie pod numer +48 538 191 200. Pomożemy rozwiązać sytuację.",
            },
        ],
    },
    {
        category: "Płatności",
        items: [
            {
                question: "Jak działają płatności na Lendigo?",
                answer: "Płatności obsługiwane są przez Stripe — jednego z największych i najbezpieczniejszych operatorów płatniczych na świecie. Lendigo nie przechowuje numerów kart płatniczych. Akceptowane są karty Visa, Mastercard oraz inne metody płatności obsługiwane przez Stripe.",
            },
            {
                question: "Kiedy zostanę obciążony/a opłatą?",
                answer: "Opłata pobierana jest w momencie potwierdzenia rezerwacji. Całkowita kwota widoczna jest przed finalizacją zamówienia — nie ma żadnych ukrytych opłat.",
            },
            {
                question: "Czy możliwy jest zwrot pieniędzy?",
                answer: "Polityka anulowania zależy od właściciela ogłoszenia i jest opisana w jego warunkach. W przypadku sporu lub niemożności odbioru z winy właściciela, skontaktuj się z nami — rozpatrzymy sprawę indywidualnie.",
            },
        ],
    },
    {
        category: "Bezpieczeństwo",
        items: [
            {
                question: "Czy wypożyczanie przez Lendigo jest bezpieczne?",
                answer: "Dbamy o bezpieczeństwo transakcji poprzez weryfikację adresów email użytkowników, bezpieczne płatności przez Stripe i szyfrowane połączenia SSL. Każdy użytkownik musi zaakceptować regulamin platformy przed złożeniem rezerwacji.",
            },
            {
                question: "Co z ubezpieczeniem wypożyczanego przedmiotu?",
                answer: "Lendigo jest platformą pośredniczącą i nie oferuje ubezpieczenia przedmiotów. Zalecamy, aby właściciele sprawdzili zakres swojej polisy ubezpieczeniowej. Wypożyczający odpowiada za przedmiot przez cały czas trwania wypożyczenia i jest zobowiązany zwrócić go w stanie nienaruszonym.",
            },
            {
                question: "Co jeśli przedmiot ulegnie uszkodzeniu?",
                answer: "Wszelkie szkody powinny być zgłaszane bezpośrednio między stronami transakcji. Zalecamy dokumentowanie stanu przedmiotu przed odbiorem (zdjęcia). Lendigo może pośredniczyć w sporach — skontaktuj się z nami na lendigo00@gmail.com.",
            },
        ],
    },
    {
        category: "Wystawianie ogłoszeń",
        items: [
            {
                question: "Jak dodać ogłoszenie na Lendigo?",
                answer: "Zaloguj się lub zarejestruj, a następnie kliknij „Dodaj ogłoszenie". Wypełnij formularz: tytuł, opis, kategoria, lokalizacja, cena za dzień i zdjęcia przedmiotu. Ogłoszenie trafia do moderacji i pojawia się na stronie po zatwierdzeniu.",
            },
            {
                question: "Ile kosztuje wystawienie ogłoszenia?",
                answer: "Wystawienie ogłoszenia jest bezpłatne. Lendigo może pobierać prowizję od zrealizowanych transakcji — aktualny cennik dostępny jest w ustawieniach konta po zalogowaniu.",
            },
            {
                question: "Jak ustawić ceny i dostępność?",
                answer: "W swoim dashboardzie możesz ustawić cenę bazową za dzień, zdefiniować reguły rabatowe dla dłuższych wypożyczeń (np. -10% od 3 dni) oraz blokować konkretne daty w kalendarzu, gdy przedmiot jest niedostępny.",
            },
        ],
    },
]

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            {/* Hero */}
            <section className="bg-white border-b border-black/[0.06] py-16 px-6">
                <div className="max-w-[720px] mx-auto">
                    <h1 className="text-[42px] font-bold tracking-tighter text-[#1d1d1f] mb-4">
                        Często zadawane pytania
                    </h1>
                    <p className="text-[19px] text-[#6e6e73] font-light leading-relaxed">
                        Znalazłeś pytanie, na które nie ma tu odpowiedzi? Napisz do nas:{" "}
                        <a href="mailto:lendigo00@gmail.com" className="text-[#0071e3] hover:underline">lendigo00@gmail.com</a>
                    </p>
                </div>
            </section>

            {/* FAQ sections */}
            <section className="max-w-[720px] mx-auto px-6 py-16">
                <div className="space-y-16">
                    {faqs.map(({ category, items }) => (
                        <div key={category}>
                            <h2 className="text-[22px] font-bold tracking-tight text-[#1d1d1f] mb-8 pb-3 border-b border-black/[0.06]">
                                {category}
                            </h2>
                            <div className="space-y-8">
                                {items.map(({ question, answer }) => (
                                    <div key={question}>
                                        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{question}</h3>
                                        <p className="text-[15px] text-[#6e6e73] leading-relaxed font-light">{answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-black/[0.06]">
                    <p className="text-[15px] text-[#6e6e73] mb-4">Nie znalazłeś odpowiedzi? Skontaktuj się z nami:</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="mailto:lendigo00@gmail.com" className="text-[#0071e3] hover:underline text-[15px] font-medium">
                            lendigo00@gmail.com
                        </a>
                        <a href="tel:+48538191200" className="text-[#0071e3] hover:underline text-[15px] font-medium">
                            +48 538 191 200
                        </a>
                    </div>
                    <div className="mt-6">
                        <Link href="/jak-to-dziala" className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f]">
                            ← Jak to działa?
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
