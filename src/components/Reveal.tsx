import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
} & Omit<HTMLMotionProps<'div'>, 'children' | 'initial' | 'whileInView' | 'viewport' | 'transition'>

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.58, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
