import React from 'react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export default function CategorySelect({ value, onChange, categories, categoryColors, categoryEmojis }) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">

          {/* Trigger button */}
          <ListboxButton
            className={clsx(
              'relative w-full rounded-xl px-4 py-2.5',
              'text-left text-sm font-medium text-black/90',
              'border border-black/[0.08] bg-white/60 backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green/50',
              'hover:border-black/[0.14] hover:bg-white/80 hover:shadow-sm',
              'transition-all duration-200 cursor-pointer',
              open && 'border-accent-green/40 ring-2 ring-accent-green/20 bg-white/90'
            )}
          >
            <span className="flex items-center justify-between gap-2">
              {/* Selected value */}
              <span className="flex items-center gap-2.5 truncate">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: (categoryColors[value] || '#94a3b8') + '18' }}
                >
                  {categoryEmojis[value]}
                </span>
                <span style={{ color: categoryColors[value] || 'inherit' }}>
                  {value}
                </span>
              </span>

              {/* Chevron */}
              <ChevronDown
                size={15}
                className={clsx(
                  'text-black/25 flex-shrink-0 transition-transform duration-200',
                  open && 'rotate-180 text-black/50'
                )}
              />
            </span>
          </ListboxButton>

          {/* Dropdown panel */}
          <ListboxOptions
            className={clsx(
              'absolute z-50 w-full mt-2',
              'bg-white/95 backdrop-blur-md',
              'border border-black/[0.07] rounded-2xl shadow-xl',
              'overflow-hidden py-1.5',
              'focus:outline-none',
              // Animate in
              'transition-all duration-150',
              'data-[leave]:opacity-0 data-[leave]:scale-95',
              'data-[enter]:opacity-100 data-[enter]:scale-100'
            )}
          >
            {/* Scrollable list */}
            <div className="max-h-60 overflow-y-auto overscroll-contain">
              {categories.map((category) => {
                const color = categoryColors[category] || '#94a3b8'
                const emoji = categoryEmojis[category]

                return (
                  <ListboxOption
                    key={category}
                    value={category}
                    className="focus:outline-none"
                  >
                    {({ selected, focus }) => (
                      <div
                        className={clsx(
                          'relative flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-xl',
                          'cursor-pointer select-none transition-all duration-100',
                          focus && !selected && 'bg-black/[0.03]',
                          selected && 'bg-opacity-10',
                        )}
                        style={{
                          background: selected ? color + '12' : undefined,
                        }}
                      >
                        {/* Color dot / emoji badge */}
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-transform duration-150"
                          style={{
                            background: color + '20',
                            transform: focus ? 'scale(1.1)' : 'scale(1)',
                          }}
                        >
                          {emoji}
                        </span>

                        {/* Category name */}
                        <span
                          className={clsx(
                            'flex-1 text-sm font-medium transition-colors duration-100',
                            selected ? 'font-semibold' : 'text-black/70'
                          )}
                          style={{ color }}
                        >
                          {category}
                        </span>

                        {/* Selected checkmark */}
                        <span
                          className={clsx(
                            'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150',
                            selected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                          )}
                          style={{ background: color + '25' }}
                        >
                          <Check size={11} style={{ color }} strokeWidth={3} />
                        </span>

                        {/* Focus dot (when not selected) */}
                        {focus && !selected && (
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: color }}
                          />
                        )}
                      </div>
                    )}
                  </ListboxOption>
                )
              })}
            </div>
          </ListboxOptions>

        </div>
      )}
    </Listbox>
  )
}