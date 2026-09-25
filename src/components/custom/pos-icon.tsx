const PosIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* screen */}
    <rect x="3" y="3" width="18" height="12" rx="2" />

    {/* card slot */}
    <rect x="6" y="7" width="12" height="3" rx="1" />

    {/* buttons */}
    <circle cx="8" cy="18" r="1" />
    <circle cx="12" cy="18" r="1" />
    <circle cx="16" cy="18" r="1" />
  </svg>
);

export default PosIcon;