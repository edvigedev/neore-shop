interface IconProps {
  className?: string;
}

const MinusIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    className={className}
  >
    <path d="M19 13H5v-2h14v2z" />
  </svg>
);

export default MinusIcon;
