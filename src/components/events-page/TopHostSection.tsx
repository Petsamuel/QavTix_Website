'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { space_grotesk } from '@/lib/fonts'
import CarouselActionBtns from '../custom-utils/buttons/CarouselActionBtns'
import TopHostCard from '../custom-utils/cards/TopHostCard'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'

interface Props {
  hosts: TrendingHost[]
}

const MIN_SLIDES_FOR_LOOP = 6     // minimum real slides to even consider looping
const MIN_DUPLICATES = 3   // at least 3 full sets → usually enough buffer

export default function TopHostsSection({ hosts }: Props) {
  const isMobile = !useMediaQuery('(min-width: 768px)')
  const isDesktop = !isMobile

  const hasEnoughForSmoothLoop = hosts.length >= MIN_SLIDES_FOR_LOOP

  const shouldLoop = isMobile || hasEnoughForSmoothLoop
  const shouldAutoplay = shouldLoop

  let displayHosts: (TrendingHost & { _key: string })[] = hosts.map((h, i) => ({
    ...h,
    _key: `${h.id}-${i}`,
  }))

  if (shouldLoop) {
    const copiesNeeded = Math.max(MIN_DUPLICATES, Math.ceil(2.5 * (isDesktop ? 3 : 1.5))) // rough heuristic
    const sets = Array.from({ length: copiesNeeded }, (_, setIdx) =>
      hosts.map((h, idx) => ({
        ...h,
        _key: `${h.id}-set${setIdx}-${idx}`,
      }))
    )

    displayHosts = sets.flat()
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: shouldLoop,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
      watchDrag: shouldLoop,
      startIndex: shouldLoop ? hosts.length : 0,
    },
    shouldAutoplay
      ? [Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })]
      : []
  )

  const scrollPrev = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop()
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop()
    emblaApi?.scrollNext()
  }, [emblaApi])

  const pauseAutoPlay = useCallback(() => emblaApi?.plugins()?.autoplay?.stop(), [emblaApi])
  const playAutoPlay = useCallback(() => emblaApi?.plugins()?.autoplay?.play(), [emblaApi])

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    const timer = setTimeout(() => emblaApi?.reInit(), 50)
    return () => clearTimeout(timer)
  }, [emblaApi, onSelect])

  if (hosts.length === 0) return null

  return (
    <section className="w-full lg:mt-26 pt-16 md:pt-10 pb-16 px-4 md:ps-10 lg:ps-16 md:pe-0">
      <div>
        <div className="flex pe-4 items-center gap-6 justify-between mb-8 md:pe-10">
          <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
            Top Hosts
          </h2>
          {shouldLoop && (
            <CarouselActionBtns
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              canScrollPrev={canScrollPrev}
              canScrollNext={canScrollNext}
            />
          )}
        </div>
        {!shouldLoop ? (
          <div className="mt-12 flex flex-wrap gap-6 px-3">
            {displayHosts.map(host => (
              <TopHostCard key={host._key} host={host} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden mt-12 py-4" ref={emblaRef}>
            <div className="flex gap-6 px-3">
              {displayHosts.map(host => (
                <TopHostCard
                  key={host._key}
                  host={host}
                  onMouseOver={pauseAutoPlay}
                  onMouseLeave={playAutoPlay}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}