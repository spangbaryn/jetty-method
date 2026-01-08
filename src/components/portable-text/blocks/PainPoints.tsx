interface PainPointsProps {
  label?: string
  items: string[]
}

export function PainPoints({ label = 'Sound familiar?', items }: PainPointsProps) {
  return (
    <div
      className="relative bg-white border-2 border-[#2c2c2c] rounded-lg px-9 py-7 my-8"
      data-testid="pain-points"
    >
      <span className="absolute -top-3 left-5 bg-[#fffef9] px-2.5 font-caveat text-base text-gray-500">
        {label}
      </span>
      <ul className="space-y-4">
        {items?.map((item, index) => (
          <li key={index} className="relative pl-8 text-[17px]">
            <span className="absolute left-0 -top-0.5 font-caveat text-2xl text-red-600">~</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
