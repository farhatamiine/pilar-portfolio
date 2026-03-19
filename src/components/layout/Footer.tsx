export function Footer() {
  return (
    <footer className="bg-ink px-8 md:px-20 py-8 flex items-center justify-between border-t border-accent/10">
      <span className="font-mono text-xs text-paper/60 tracking-[0.15em]">
        © {new Date().getFullYear()} Pilar Olivero
      </span>
      <div className="flex items-center gap-8">
        <a
          href="https://instagram.com/pilarolivero"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-paper/60 hover:text-accent transition-colors tracking-[0.15em] uppercase"
        >
          Instagram ↗
        </a>
        <span className="hidden sm:block font-mono text-xs text-paper/40 tracking-[0.15em]">
          Buenos Aires · Paris
        </span>
      </div>
    </footer>
  )
}
