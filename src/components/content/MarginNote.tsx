import { ReactNode } from 'react'

interface MarginNoteProps {
  children: ReactNode
}

export function MarginNote({ children }: MarginNoteProps) {
  return (
    <aside className="bg-[#f9f9f5] border-l-4 border-[#2c2c2c] py-4 px-5 my-6 font-caveat text-lg text-[#555] rounded-r-lg">
      {children}
    </aside>
  )
}
