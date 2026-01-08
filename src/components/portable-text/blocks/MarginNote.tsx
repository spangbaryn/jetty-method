interface MarginNoteProps {
  content: string
}

export function MarginNote({ content }: MarginNoteProps) {
  return (
    <aside
      className="my-6 p-4 bg-amber-50 border-l-4 border-amber-300 font-caveat text-lg text-gray-700"
      data-testid="margin-note"
    >
      {content}
    </aside>
  )
}
