export type PillColor = "primary" | "green" | "red" | "yellow"

interface PillProps {
  children: React.ReactNode;
  color: PillColor;
  className: string;
}
export default function Pill({ children, color = "primary", className = "" }: PillProps) {
  const colorClasses = {
    primary: "bg-primary-100 text-primary-500",
    green: "bg-green-100 text-green-500",
    red: "bg-red-100 text-red-500",
    yellow: "bg-yellow-100 text-yellow-600",
  }

  const pillClasses = `
    inline-flex item-center justify-center rounded-full px-2 py-1
    ${colorClasses[color]}
    ${className}
  `

  return (
    <span className={pillClasses}>
      {children}
    </span>
  )
}