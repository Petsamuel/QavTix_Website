import React from "react";
import { Icon } from "@iconify/react";
import LiquidBtn from "./LiquidButton";

type CarouselActionBtnsProps = {
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    className?: string;
}

const CarouselActionBtns: React.FC<CarouselActionBtnsProps> = ({
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    className = "",
}) => {
    return (
        <div className={`flex gap-3 ${className}`}>
            <LiquidBtn
                onClick={scrollPrev}
                variant="ghost"
                disabled={!canScrollPrev}
                aria-label="Previous slide"
                size="sm"
            >
                <Icon icon="si:chevron-left-line" width="24" height="24" />
            </LiquidBtn>

            <LiquidBtn
                onClick={scrollNext}
                variant="primary"
                disabled={!canScrollNext}
                aria-label="Next slide"
                size="sm"
            >
                <Icon icon="si:chevron-right-line" width="24" height="24" className="text-white" />
            </LiquidBtn>
        </div>
    )
}

export default CarouselActionBtns;