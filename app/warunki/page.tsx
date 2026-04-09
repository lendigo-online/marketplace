import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Warunki korzystania",
    description: "Zapoznaj się z warunkami korzystania z platformy Lendigo — zasadami wystawiania ogłoszeń, płatności, odpowiedzialności i ochrony użytkowników.",
    alternates: {
        canonical: "https://www.lendigo.online/warunki",
    },
}

export default function WarunkiPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd] py-16 px-6">
            <div className="max-w-[720px] mx-auto">
                <h1 className="text-[36px] font-bold tracking-tighter text-[#1d1d1f] mb-2">Warunki korzystania</h1>
                <p className="text-[14px] text-[#6e6e73] mb-12">Ostatnia aktualizacja: 25 marca 2026</p>

                <div className="space-y-10 text-[15px] text-[#1d1d1f] leading-relaxed">

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">1. Postanowienia ogólne</h2>
                        <p className="text-[#6e6e73]">
                            Serwis Lendigo (dostępny pod adresem lendigo.online) jest platformą internetową umożliwiającą użytkownikom
                            wystawianie ogłoszeń dotyczących wypożyczenia przedmiotów oraz zawieranie umów wypożyczenia między użytkownikami.
                            Operatorem serwisu jest Lendigo. Korzystanie z serwisu oznacza akceptację niniejszych warunków.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">2. Rejestracja i konto użytkownika</h2>
                        <p className="text-[#6e6e73]">
                            Korzystanie z pełnej funkcjonalności serwisu wymaga rejestracji. Użytkownik zobowiązuje się do podania
                            prawdziwych danych, zachowania hasła w tajemnicy oraz niezwłocznego poinformowania serwisu o nieautoryzowanym
                            dostępie do konta. Jeden użytkownik może posiadać jedno konto. Konta tworzone w celu obejścia regulaminu
                            będą usuwane.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">3. Zasady wystawiania ogłoszeń</h2>
                        <p className="text-[#6e6e73] mb-3">
                            Użytkownik wystawiający ogłoszenie oświadcza, że jest właścicielem lub uprawniony do wypożyczania
                            danego przedmiotu. Zabrania się wystawiania ogłoszeń dotyczących:
                        </p>
                        <ul className="list-disc pl-5 text-[#6e6e73] space-y-1">
                            <li>przedmiotów nielegalnych lub zakazanych przez prawo,</li>
                            <li>broni, materiałów wybuchowych i niebezpiecznych substancji,</li>
                            <li>przedmiotów naruszających prawa osób trzecich,</li>
                            <li>przedmiotów, których wypożyczenie jest prawnie ograniczone.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">4. Odpowiedzialność stron</h2>
                        <p className="text-[#6e6e73]">
                            Lendigo pełni wyłącznie rolę pośrednika i nie jest stroną umowy wypożyczenia zawieranej między
                            użytkownikami. Serwis nie ponosi odpowiedzialności za stan techniczny wypożyczanych przedmiotów,
                            prawdziwość opisów w ogłoszeniach, ani za szkody wynikłe z realizacji umów zawartych za pośrednictwem
                            platformy. Użytkownicy zawierają umowy na własne ryzyko.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">5. Płatności</h2>
                        <p className="text-[#6e6e73]">
                            Płatności w serwisie obsługiwane są przez Stripe Inc. Lendigo nie przechowuje danych kart płatniczych.
                            Ceny podane w ogłoszeniach są cenami brutto w złotych polskich (PLN). Serwis może pobierać prowizję
                            od transakcji — aktualny cennik dostępny jest w ustawieniach konta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">6. Zakaz kopiowania treści</h2>
                        <p className="text-[#6e6e73]">
                            Wszelkie treści zamieszczone w serwisie Lendigo, w tym logotypy, grafiki, układ strony i kod źródłowy,
                            są chronione prawem autorskim. Kopiowanie, reprodukowanie lub wykorzystywanie treści bez zgody operatora
                            jest zabronione.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">7. Zmiany regulaminu</h2>
                        <p className="text-[#6e6e73]">
                            Lendigo zastrzega sobie prawo do zmiany niniejszych warunków. O istotnych zmianach użytkownicy będą
                            informowani drogą mailową lub poprzez komunikat w serwisie. Dalsze korzystanie z serwisu po wprowadzeniu
                            zmian oznacza ich akceptację.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">8. Kontakt</h2>
                        <p className="text-[#6e6e73]">
                            W sprawach dotyczących regulaminu prosimy o kontakt:
                            <br />
                            Email: <a href="mailto:lendigo00@gmail.com" className="text-[#0071e3] hover:underline">lendigo00@gmail.com</a>
                            <br />
                            Telefon: <a href="tel:+48538191200" className="text-[#0071e3] hover:underline">+48 538 191 200</a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
