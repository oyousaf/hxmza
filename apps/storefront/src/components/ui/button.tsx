import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@lib/utils"
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-stone-800 text-white hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300", outline: "border border-stone-400 bg-transparent text-stone-800 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-800" }, size: { default: "h-12 px-6 py-2", sm: "h-9 px-3" } }, defaultVariants: { variant: "default", size: "default" } })
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({className, variant, size, asChild=false, ...props},ref) => { const Comp=asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({variant,size,className}))} ref={ref} {...props} /> })
Button.displayName="Button"
export { Button, buttonVariants }
