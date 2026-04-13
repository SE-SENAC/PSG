"use client"

import { motion } from "framer-motion"

type Props = {
  href: string
  children: React.ReactNode
  label: string
}

export function SocialIcon({ href, children, label }: Props) {
  return (
    <motion.a
      href={href}
      target="_blank"
      aria-label={label}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="bg-orange-500 hover:bg-orange-400 transition w-10 h-10 rounded-full flex items-center justify-center"
    >
      {children}
    </motion.a>
  )
}