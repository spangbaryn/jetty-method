interface DividerProps {
  symbol?: string
}

export function Divider({ symbol = '✦' }: DividerProps) {
  return (
    <div className="flex items-center justify-center gap-5 my-12 text-[#ccc]">
      <span className="flex-1 h-px bg-[#ddd]" />
      <span>{symbol}</span>
      <span className="flex-1 h-px bg-[#ddd]" />
    </div>
  )
}
