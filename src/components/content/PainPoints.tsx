import { ReactNode } from 'react'

interface PainPointsProps {
  children: ReactNode
}

export function PainPoints({ children }: PainPointsProps) {
  return (
    <div className="pain-points bg-white border-2 border-[#2c2c2c] rounded-lg py-7 px-9 my-8 relative" data-testid="pain-points">
      <span
        className="font-caveat text-base text-[#666] absolute -top-3 left-5 bg-background px-2"
      >
        Sound familiar?
      </span>
      <ul className="list-none m-0 p-0 [&_li]:relative [&_li]:pl-8 [&_li]:mb-4 [&_li]:text-[17px] [&_li:last-child]:mb-0">
        {children}
      </ul>
    </div>
  )
}

interface PainPointItemProps {
  children: ReactNode
}

export function PainPointItem({ children }: PainPointItemProps) {
  return (
    <li className="relative pl-8 mb-4 text-[17px] last:mb-0">
      <span className="absolute left-0 font-caveat text-2xl text-red-700 -top-0.5">~</span>
      {children}
    </li>
  )
}
