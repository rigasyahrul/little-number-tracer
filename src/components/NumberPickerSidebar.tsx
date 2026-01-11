interface NumberPickerSidebarProps {
  selectedNumber: number
  onSelectNumber: (n: number) => void
}

export function NumberPickerSidebar({
  selectedNumber,
  onSelectNumber,
}: NumberPickerSidebarProps) {
  const numbers = Array.from({ length: 10 }, (_, i) => i)

  return (
    <aside className="w-full h-full bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {numbers.map((n) => (
          <button
            key={n}
            onClick={() => onSelectNumber(n)}
            className={[
              'w-full py-3 flex items-center justify-center text-4xl font-bold border-b border-gray-200 last:border-b-0 transition-colors',
              n === selectedNumber
                ? 'bg-primary-green text-text-light'
                : 'bg-white hover:bg-gray-100 text-text-dark',
            ].join(' ')}
          >
            {n}
          </button>
        ))}
      </div>
    </aside>
  )
}
