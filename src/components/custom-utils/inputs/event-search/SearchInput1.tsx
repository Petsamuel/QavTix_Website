'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/components-data/navigation/navLinks'

interface SearchEventInputProps {
  placeholder?: string
  className?: string
  minSearchLength?: number
  debounceMs?: number
  onSearch?: (query: string) => void
}

export default function SearchInput1({
  placeholder = 'Search event',
  className,
  minSearchLength = 3,
  debounceMs = 500,
  onSearch
}: SearchEventInputProps) {

  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchValue.length < minSearchLength) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      handleSearch(searchValue)
      setIsSearching(false)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchValue, minSearchLength, debounceMs])

  const handleSearch = useCallback((query: string) => {
    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`${NAV_LINKS.SEARCH_PAGE.href}?q=${encodeURIComponent(query)}`)
    }
  }, [onSearch, router])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.length >= minSearchLength) {
      handleSearch(searchValue)
    }
  }

  return (
    <div className={cn('w-fit', className)}>
      <div
        className={cn(
          'relative flex items-center gap-2 px-4 py-3.5',
          'rounded-full border h-10 text-sm transition-all duration-200 bg-neutral-2',
          isFocused
            ? 'border-primary-7 shadow-sm'
            : 'border-neutral-5 hover:border-neutral-4'
        )}
      >
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'flex-1 outline-none bg-transparent text-sm text-neutral-9',
            'placeholder:text-neutral-6'
          )}
        />

        {isSearching ? (
          <Icon
            icon="lucide:loader-2"
            className="size-6 shrink-0 text-primary-6 animate-spin"
          />
        ) : (
          <Icon
            icon="lucide:search"
            className={cn(
              'size-6 shrink-0 transition-colors',
              isFocused ? 'text-primary-6' : 'text-neutral-6'
            )}
          />
        )}
      </div>
    </div>
  )
}