export default function HelpCancellationIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M110 44.3947C109.665 36.6844 108.728 31.6649 106.102 27.6942C104.591 25.4098 102.714 23.4229 100.556 21.8234C94.7233 17.5 86.4951 17.5 70.0387 17.5H49.9653C33.5089 17.5 25.2807 17.5 19.4481 21.8234C17.2902 23.4229 15.4133 25.4098 13.9024 27.6942C11.2763 31.6644 10.3388 36.6832 10.0041 44.3922C9.94691 45.7104 11.0824 46.7188 12.3265 46.7188C19.2554 46.7188 24.8724 52.665 24.8724 60C24.8724 67.335 19.2554 73.2812 12.3265 73.2812C11.0824 73.2812 9.94691 74.2896 10.0041 75.6078C10.3388 83.3168 11.2763 88.3356 13.9024 92.3058C15.4133 94.5902 17.2902 96.5771 19.4481 98.1766C25.2807 102.5 33.5089 102.5 49.9653 102.5H70.0388C86.4951 102.5 94.7233 102.5 100.556 98.1766C102.714 96.5771 104.591 94.5902 106.102 92.3058C108.728 88.3351 109.665 83.3156 110 75.6053V44.3947Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M65 60L85 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M45 80L85 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Diagonal strike-through line */}
            <path d="M10 10L110 110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    )
}
