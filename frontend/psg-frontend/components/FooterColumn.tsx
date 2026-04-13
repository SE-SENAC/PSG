type LinkItem = {
  label: string
  href: string
}

type Props = {
  title: string
  links: LinkItem[]
}

export function FooterColumn({ title, links }: Props) {
  return (
    <div>
      <h3 className="text-orange-400 font-semibold mb-3">
        {title}
      </h3>

      <ul className="space-y-2 text-sm text-white/80">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              target="_blank"
              className="hover:text-white transition"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}