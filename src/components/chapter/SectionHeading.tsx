interface SectionHeadingProps {
  id: string
  children: React.ReactNode
}

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2 id={id} className="text-2xl font-semibold mb-4 font-sans">
      <a
        href={`#${id}`}
        className="hover:underline"
        data-testid="section-anchor"
      >
        {children}
      </a>
    </h2>
  )
}
