import React from "react"

import { IconProps } from "types/icon"

const Heart: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M10 17.5s-5.58-3.63-7.75-6.75C0.83 8.42 1.17 5.5 3.5 4.17a4.5 4.5 0 0 1 6.5 1.25 4.5 4.5 0 0 1 6.5-1.25c2.33 1.33 2.67 4.25.75 6.58C15.58 13.87 10 17.5 10 17.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Heart
