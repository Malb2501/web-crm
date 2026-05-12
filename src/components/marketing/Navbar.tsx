"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Zap } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-[#1E3A5F] tracking-tight">
              PipeFlow
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-[#1E3A5F] transition-colors font-medium">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-[#1E3A5F] transition-colors font-medium">
              Preços
            </a>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-[#1E3A5F] transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50"
            >
              Funcionalidades
            </a>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50"
            >
              Preços
            </a>
            <div className="border-t border-slate-100 mt-2 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-center"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] px-5 py-2.5 rounded-lg text-center transition-colors"
              >
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
