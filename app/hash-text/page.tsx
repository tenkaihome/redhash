"use client"

import { useState } from "react"
import { Heart, Copy, ChevronDown, Check } from "lucide-react"
import CryptoJS from "crypto-js"

export default function HashText() {
    const [text, setText] = useState("")
    const [encoding, setEncoding] = useState<"hex" | "base64">("hex")
    const [copiedHash, setCopiedHash] = useState<string | null>(null)

    const handleCopy = (hashValue: string, algorithm: string) => {
        if (!hashValue) return

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(hashValue).then(() => {
                setCopiedHash(algorithm)
                setTimeout(() => setCopiedHash(null), 2000)
            }).catch(() => {
                fallbackCopy(hashValue, algorithm)
            })
        } else {
            fallbackCopy(hashValue, algorithm)
        }
    }

    const fallbackCopy = (hashValue: string, algorithm: string) => {
        try {
            const textArea = document.createElement("textarea")
            textArea.value = hashValue
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            textArea.remove()
            setCopiedHash(algorithm)
            setTimeout(() => setCopiedHash(null), 2000)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    const algorithms = [
        { name: "MD5", method: CryptoJS.MD5 },
        { name: "SHA1", method: CryptoJS.SHA1 },
        { name: "SHA256", method: CryptoJS.SHA256 },
        { name: "SHA224", method: CryptoJS.SHA224 },
        { name: "SHA512", method: CryptoJS.SHA512 },
        { name: "SHA384", method: CryptoJS.SHA384 },
        { name: "SHA3", method: CryptoJS.SHA3 },
        { name: "RIPEMD160", method: CryptoJS.RIPEMD160 },
    ]

    const getHash = (method: (message: string) => CryptoJS.lib.WordArray) => {
        if (!text) return ""
        const hash = method(text)
        if (encoding === "hex") {
            return hash.toString(CryptoJS.enc.Hex)
        } else {
            return hash.toString(CryptoJS.enc.Base64)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 text-stone-300">
            <div className="flex justify-between items-start mb-6">
                <div className="relative w-full border-b border-[#2b1f1f] pb-3">
                    <h1 className="text-4xl font-semibold text-stone-100 inline-block relative">
                        Hash text
                        <div className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-rose-600"></div>
                    </h1>
                    <button className="absolute right-0 top-2 text-stone-500 hover:text-stone-100 transition-colors">
                        <Heart className="w-5 h-5 fill-current" />
                    </button>
                </div>
            </div>

            <p className="text-stone-400 mb-8 max-w-3xl text-[15px] leading-relaxed">
                Hash a text string using the function you need : MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3 or RIPEMD160
            </p>

            <div className="bg-[#1c1414] border border-[#2b1f1f] rounded-md p-6 sm:p-8 shadow-sm">
                <label className="block text-[15px] text-stone-300 mb-3">Your text to hash:</label>
                <div className="relative mb-8">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Your string to hash..."
                        className="w-full bg-[#2b1f1f] border border-transparent rounded-md px-4 py-4 text-stone-300 resize-y focus:outline-none focus:border-[#4dbb9c] min-h-[120px] shadow-inner text-[15px] font-sans placeholder:text-stone-500 transition-colors"
                    />
                </div>

                <div className="h-px bg-[#2e323b] w-full mb-8"></div>

                <label className="block text-[15px] text-stone-300 mb-3">Digest encoding</label>
                <div className="relative mb-8 max-w-full">
                    <select
                        value={encoding}
                        onChange={(e) => setEncoding(e.target.value as "hex" | "base64")}
                        className="w-full bg-[#2b1f1f] border border-transparent rounded-md px-4 py-3 text-stone-300 appearance-none focus:outline-none focus:border-[#4dbb9c] shadow-inner text-[15px] transition-colors"
                    >
                        <option value="hex">Hexadecimal (base 16)</option>
                        <option value="base64">Base64</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-stone-400">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                <div className="flex flex-col rounded-md border border-[#2b1f1f] overflow-hidden bg-[#2b1f1f]">
                    {algorithms.map((algo) => {
                        const hashValue = getHash(algo.method)
                        return (
                            <div
                                key={algo.name}
                                className={`flex items-stretch border-b border-[#2b1f1f] last:border-b-0`}
                            >
                                <div className="w-[120px] sm:w-[150px] px-4 py-3 text-[14px] font-medium text-stone-100 bg-[#3b2b2b] border-r border-[#2b1f1f] shrink-0 flex items-center">
                                    {algo.name}
                                </div>
                                <div className="flex-1 px-4 py-3 text-[14px] text-stone-300 font-mono break-all flex items-center min-h-[46px] selection:bg-rose-600/30">
                                    {hashValue}
                                </div>
                                <button
                                    onClick={() => handleCopy(hashValue, algo.name)}
                                    disabled={!text}
                                    className={`w-[46px] flex-shrink-0 flex items-center justify-center border-l border-[#2b1f1f] transition-colors ${!text ? 'text-zinc-600 cursor-not-allowed' : copiedHash === algo.name ? 'text-[#4dbb9c] bg-rose-600/10' : 'text-stone-400 hover:text-stone-100 hover:bg-[#4d3939]'}`}
                                    title={copiedHash === algo.name ? "Copied" : "Copy to clipboard"}
                                >
                                    {copiedHash === algo.name ? <Check className="w-[18px] h-[18px]" /> : <Copy className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
