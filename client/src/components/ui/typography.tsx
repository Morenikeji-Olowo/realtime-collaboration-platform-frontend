import * as React from "react"
import { cn } from "@/lib/utils"

// Document title — for the editor's own title (spec 9.2): dominant, not oversized.
export function Title({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-semibold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  )
}

export function H1({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  )
}

export function H2({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function H3({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function H4({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

// Body text — spec 3.2: 16-18px, 1.55-1.7 line-height. text-base + leading-relaxed
// (1.625) sits centered in that range; editor surfaces can bump to text-lg for
// the 18px end without touching this component.
export function P({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-base leading-relaxed [&:not(:first-child)]:mt-4",
        className
      )}
      {...props}
    />
  )
}

export function Lead({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xl text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

export function Muted({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export function Small({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

// Metadata/timestamps — spec 3.2: "numbers, timestamps and technical metadata
// should use tabular numerals where helpful." Compose with Muted/Small as needed,
// e.g. <Muted className={metaNumeric()}>2:41 PM</Muted>
export function metaNumeric(className?: string) {
  return cn("tabular-nums", className)
}