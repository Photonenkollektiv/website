import styles from "./page.module.css"

export const Header = () => (<div className={styles.header}>
    <div className={styles.svgShadow}>
        <svg viewBox="-50 40 260 380" xmlns="http://www.w3.org/2000/svg">
            <g fill="#fff">
                <path d="M76 0v108a32 28 0 0 0-28 23h63a32 28 0 0 0-26-23V0Z" />
                <path id="logo-glow-path" d="M80 294a18 18 0 0 0-18 19 18 18 0 0 0 18 18 18 18 0 0 0 18-18 18 18 0 0 0-18-19Z" />
                <path id="logo-glow-path" d="M80 222a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 6-7 7 7 0 0 0-6-7z" />
                <path id="logo-glow-path" d="M41 198s0 18-4 24c-5 9-16 19-16 19h1a76 76 0 0 0-22 58c4 45 36 79 81 79s75-38 78-73c0-34-9-53-26-68-3-4-9-10-11-16-4-6-3-23-3-23H41zm39 11a20 20 0 0 1 20 20 20 20 0 0 1-20 20 20 20 0 0 1-20-20 20 20 0 0 1 20-20zm0 50a53 53 0 0 1 53 54 53 53 0 0 1-53 53 53 53 0 0 1-54-53 53 53 0 0 1 54-54z" />
                <path d="M40 178h79s5 1 5 6-5 5-5 5H40s-4-1-4-6c0-4 4-5 4-5z" />
                <path d="M40 159h79s5 0 5 5-5 6-5 6H40s-4-1-4-6c0-4 4-5 4-5z" />
                <path d="M40 139h79s5 1 5 6-5 5-5 5H40s-4-1-4-6c0-4 4-5 4-5z" />
            </g>
        </svg>
        {/* Für alle aus dem Kollektiv, hier der Downloadlink: https://photonenkollektiv.de/images/logo.svg */}
    </div>
    <div className={styles.headerContent}>
        <h1>Photonenkollektiv</h1>

        <p>Ein Verein zur Förderung der Hör- und Sichtbarkeit von Kulturveranstaltungen</p>
    </div>
</div>)