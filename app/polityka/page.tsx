export default function PolitykaPrywatnosci() {
    return (
        <div className="min-h-screen bg-[#fbfbfd] py-16 px-6">
            <div className="max-w-[720px] mx-auto">
                <h1 className="text-[36px] font-bold tracking-tighter text-[#1d1d1f] mb-2">Polityka prywatności</h1>
                <p className="text-[14px] text-[#6e6e73] mb-12">Ostatnia aktualizacja: 25 marca 2026</p>

                <div className="space-y-10 text-[15px] text-[#1d1d1f] leading-relaxed">

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">1. Administrator danych</h2>
                        <p className="text-[#6e6e73]">
                            Administratorem Twoich danych osobowych jest Lendigo. W sprawach dotyczących danych osobowych
                            możesz skontaktować się z nami pod adresem:{" "}
                            <a href="mailto:lendigo00@gmail.com" className="text-[#0071e3] hover:underline">lendigo00@gmail.com</a>
                            {" "}lub telefonicznie:{" "}
                            <a href="tel:+48538191200" className="text-[#0071e3] hover:underline">+48 538 191 200</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">2. Jakie dane zbieramy</h2>
                        <p className="text-[#6e6e73] mb-3">W trakcie korzystania z serwisu możemy zbierać następujące dane:</p>
                        <ul className="list-disc pl-5 text-[#6e6e73] space-y-1">
                            <li>imię i nazwisko lub pseudonim,</li>
                            <li>adres e-mail,</li>
                            <li>hasło (przechowywane wyłącznie w postaci zaszyfrowanej — bcrypt),</li>
                            <li>treść ogłoszeń, zdjęcia przedmiotów oraz dane rezerwacji,</li>
                            <li>adres IP i dane techniczne przeglądarki (logi serwera).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">3. Cel i podstawa przetwarzania</h2>
                        <p className="text-[#6e6e73] mb-3">Twoje dane przetwarzamy w celu:</p>
                        <ul className="list-disc pl-5 text-[#6e6e73] space-y-1">
                            <li>realizacji usług świadczonych przez platformę (art. 6 ust. 1 lit. b RODO),</li>
                            <li>wypełnienia obowiązków prawnych, w tym podatkowych (art. 6 ust. 1 lit. c RODO),</li>
                            <li>obsługi Twojego konta i komunikacji z Tobą (art. 6 ust. 1 lit. b RODO),</li>
                            <li>zapewnienia bezpieczeństwa serwisu i zapobiegania nadużyciom (art. 6 ust. 1 lit. f RODO).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">4. Udostępnianie danych</h2>
                        <p className="text-[#6e6e73]">
                            Twoje dane nie są sprzedawane ani udostępniane osobom trzecim w celach marketingowych.
                            Dane mogą być przekazywane wyłącznie podmiotom przetwarzającym dane w naszym imieniu
                            (hosting, obsługa płatności przez Stripe) na podstawie stosownych umów powierzenia,
                            a także organom publicznym, gdy wymagają tego przepisy prawa.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">5. Pliki cookies</h2>
                        <p className="text-[#6e6e73]">
                            Serwis używa niezbędnych plików cookies do obsługi sesji użytkownika (next-auth.session-token).
                            Cookies te są niezbędne do działania serwisu i nie wymagają osobnej zgody. Nie stosujemy cookies
                            śledzących ani reklamowych.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">6. Okres przechowywania danych</h2>
                        <p className="text-[#6e6e73]">
                            Dane konta przechowywane są przez czas jego aktywności oraz przez okres niezbędny do wypełnienia
                            obowiązków prawnych (np. dokumentacja podatkowa — 5 lat). Po usunięciu konta dane są anonimizowane
                            lub usuwane, z wyjątkiem danych wymaganych przez prawo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">7. Twoje prawa</h2>
                        <p className="text-[#6e6e73] mb-3">Na podstawie RODO przysługują Ci następujące prawa:</p>
                        <ul className="list-disc pl-5 text-[#6e6e73] space-y-1">
                            <li>prawo dostępu do swoich danych,</li>
                            <li>prawo do sprostowania danych,</li>
                            <li>prawo do usunięcia danych („prawo do bycia zapomnianym"),</li>
                            <li>prawo do ograniczenia przetwarzania,</li>
                            <li>prawo do przenoszenia danych,</li>
                            <li>prawo do wniesienia sprzeciwu,</li>
                            <li>prawo do wniesienia skargi do Prezesa UODO (uodo.gov.pl).</li>
                        </ul>
                        <p className="text-[#6e6e73] mt-3">
                            Aby skorzystać z powyższych praw, skontaktuj się z nami mailowo lub telefonicznie.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[20px] font-semibold mb-3">8. Bezpieczeństwo danych</h2>
                        <p className="text-[#6e6e73]">
                            Stosujemy techniczne i organizacyjne środki ochrony danych, w tym szyfrowanie haseł (bcrypt),
                            szyfrowane połączenie SSL/TLS z bazą danych oraz nagłówki bezpieczeństwa HTTP.
                            Dane przechowywane są na serwerach Supabase zlokalizowanych w Europie.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
