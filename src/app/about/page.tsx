"use client";
export default function AboutUsPage() {
    return (
        <>
            <nav className="navbar">
                <div className="logo" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>Photonenkollektiv</div>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">Über uns</a></li>
                </ul>
            </nav>

            <header className="hero">
                <h1>Unser Team</h1>
                <p>Menschen hinter den Kulissen – kreativ, leidenschaftlich und mit einer Prise Humor.</p>
            </header>

            <section id="team">
                <h2>Mitglieder</h2>
                <div className="team-grid">
                    <div className="team-card">
                        <img src="/images/demo/member1.png" alt="Teammitglied 1" />
                        <h3>Alex „Laser“ Müller</h3>
                        <p className="role">Lichtzauberer</p>
                        <p className="desc">
                            Alex sorgt dafür, dass jede Bühne im perfekten Licht erstrahlt. Er liebt es, mit
                            Farben zu experimentieren und sagt von sich selbst, dass er mehr Nebelmaschinen
                            als Pflanzen besitzt.
                        </p>
                    </div>
                    <div className="team-card">
                        <img src="/images/demo/member2.png" alt="Teammitglied 2" />
                        <h3>Chris „Bass“ Weber</h3>
                        <p className="role">Sound‑Alchemist</p>
                        <p className="desc">
                            Ob Festival oder Club – Chris hat immer den richtigen Mix. Wenn er nicht gerade
                            am Mischpult steht, tüftelt er an selbstgebauten Synthesizern und träumt von
                            perfekten Basswellen.
                        </p>
                    </div>
                    <div className="team-card">
                        <img src="/images/demo/member3.png" alt="Teammitglied 3" />
                        <h3>Lea „Sparks“ Schneider</h3>
                        <p className="role">Technik‑Tüftlerin</p>
                        <p className="desc">
                            Lea findet immer eine kreative Lösung. Ob Sonderbau, Reparatur oder das nächste
                            DIY‑Projekt – sie hat Schraubenzieher und 3D‑Drucker immer griffbereit und liebt
                            den Geruch von Lötzinn in der Luft.
                        </p>
                    </div>
                </div>
            </section>

            <footer>
                © 2025 Photonenkollektiv e.V.
            </footer>
        </>
    );
}