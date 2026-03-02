"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    RefreshCcw, Hash, Lock, Database, ArrowDownUp, Unlock,
    KeySquare, Menu, Key, ShieldCheck, FileBadge, Heart, Search, Github, Info, Flame
} from "lucide-react"
import { DonateModal } from "./donate-modal"

const cryptoTools = [
    { name: "Tokens", href: "/token-generator", icon: RefreshCcw },
    { name: "Hash", href: "/hash-text", icon: Hash },
    { name: "Bcrypt", href: "/bcrypt", icon: Lock },
    { name: "UUIDs", href: "/uuid-generator", icon: Database },
    { name: "ULID", href: "/ulid-generator", icon: ArrowDownUp },
    { name: "Enc/Dec", href: "/encrypt-decrypt", icon: Unlock },
    { name: "BIP39", href: "/bip39-generator", icon: KeySquare },
    { name: "HMAC", href: "/hmac-generator", icon: Menu },
    { name: "RSA", href: "/rsa-generator", icon: Key },
    { name: "Strength", href: "/", icon: ShieldCheck },
    { name: "PDF Check", href: "/pdf-signature", icon: FileBadge },
]

export function TopHeader() {
    const pathname = usePathname()
    const [isDonateOpen, setIsDonateOpen] = useState(false)

    return (
        <>
            <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-lg border-b border-[#2b1f1f] text-stone-300">
                <div className="flex h-16 items-center justify-between px-6 lg:px-8 border-b border-[#2b1f1f]">
                    <Link href="/" className="flex items-center gap-2 text-rose-600 font-bold text-2xl tracking-tight shrink-0">
                        <Flame className="w-8 h-8" />
                        <span>RedHash</span>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            className="w-full bg-[#1c1414] border border-[#2b1f1f] rounded-lg pl-11 pr-4 py-2 text-sm focus:border-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-600 transition-all text-stone-200 placeholder:text-stone-500"
                        />
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-stone-300 hover:text-white transition-colors">
                            <Github className="w-4 h-4 mr-2" /> GitHub
                        </button>
                        <button
                            onClick={() => setIsDonateOpen(true)}
                            className="flex items-center bg-rose-600/10 text-rose-500 border border-rose-600/20 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            Donate
                            <Heart className="w-4 h-4 ml-2 fill-current" />
                        </button>
                    </div>
                </div>

                <nav className="flex items-center gap-1 px-4 lg:px-6 py-3 overflow-x-auto custom-scrollbar bg-[#1c1414]">
                    {cryptoTools.map((tool) => {
                        const isActive = pathname === tool.href
                        const Icon = tool.icon
                        return (
                            <Link
                                key={tool.name}
                                href={tool.href}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm font-medium transition-all rounded-md shrink-0 border border-transparent",
                                    isActive
                                        ? "bg-rose-600 text-white shadow-md shadow-rose-900/20"
                                        : "text-stone-400 hover:bg-[#2b1f1f] hover:text-stone-200 hover:border-[#3b2b2b]"
                                )}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                <span>{tool.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </header>
            <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
        </>
    )
}
