interface FooterProps { instagramUrl?: string | null }

export function Footer({ instagramUrl }: FooterProps) {
  return (
    <footer className="mt-24 px-6 py-8 border-t border-grain flex items-center justify-between">
      <span className="font-mono text-xs text-muted tracking-widest">
        © {new Date().getFullYear()} Pilar Olivero
      </span>
      {instagramUrl && (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs text-muted hover:text-accent transition-colors tracking-widest">
          Instagram ↗
        </a>
      )}
    </footer>
  )
}
