export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <div className="footer">
            <p className="text-white pt-2">© {currentYear} Mohanlal S</p>
        </div>
    )
}