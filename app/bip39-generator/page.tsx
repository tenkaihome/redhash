"use client"

import { useState, useCallback, useEffect } from "react"
import { Heart, Copy, Check, RefreshCcw } from "lucide-react"
import * as bip39 from "bip39"

export default function BIP39Generator() {
    const [wordCount, setWordCount] = useState<12 | 15 | 18 | 21 | 24>(12)
    const [phrase, setPhrase] = useState("")
    const [isCopying, setIsCopying] = useState(false)

    const generatePhrase = useCallback(() => {
        // Using bit strength mappings standard to bip39:
        const strength = wordCount === 12 ? 128 : wordCount === 15 ? 160 : wordCount === 18 ? 192 : wordCount === 21 ? 224 : 256
        const mnemonic = bip39.generateMnemonic(strength)
        setPhrase(mnemonic)
    }, [wordCount])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        generatePhrase()
    }, [generatePhrase])

    const copyToClipboard = () => {
        if (!phrase) return
        if (navigator.clipboard) {
            navigator.clipboard.writeText(phrase)
                .then(() => {
                    setIsCopying(true)
                    setTimeout(() => setIsCopying(false), 2000)
                })
                .catch(() => fallbackCopy(phrase))
        } else {
            fallbackCopy(phrase)
        }
    }

    const fallbackCopy = (text: string) => {
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        try {
            document.execCommand('copy')
            setIsCopying(true)
            setTimeout(() => setIsCopying(false), 2000)
        } catch { }
        textArea.remove()
    }

    const words = phrase.split(' ')

    return (
        <div className="max-w-4xl mx-auto py-8 text-stone-300">
            <div className="flex justify-between items-start mb-6">
                <div className="relative w-full border-b border-[#2b1f1f] pb-3">
                    <h1 className="text-4xl font-semibold text-stone-100 inline-block relative">
                        BIP39 passphrase generator
                        <div className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-rose-600"></div>
                    </h1>
                    <button className="absolute right-0 top-2 text-stone-500 hover:text-stone-100 transition-colors">
                        <Heart className="w-5 h-5 fill-current" />
                    </button>
                </div>
            </div>

            <p className="text-stone-400 mb-8 max-w-3xl text-[15px] leading-relaxed">
                Generate a BIP39 mnemonic phrase to secure cryptocurrency wallets or use as a secure, memorable password.
            </p>

            <div className="bg-[#1c1414] border border-[#2b1f1f] rounded-md p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap gap-6 mb-8 items-end">
                    <div className="flex-1 max-w-sm">
                        <label className="block text-[15px] text-stone-300 mb-2">Word count</label>
                        <select
                            value={wordCount}
                            onChange={(e) => setWordCount(Number(e.target.value) as 12 | 15 | 18 | 21 | 24)}
                            className="w-full bg-[#2b1f1f] border border-transparent rounded-md px-4 py-3 text-stone-300 focus:outline-none focus:border-[#4dbb9c] transition-colors"
                        >
                            <option value={12}>12 words</option>
                            <option value={15}>15 words</option>
                            <option value={18}>18 words</option>
                            <option value={21}>21 words</option>
                            <option value={24}>24 words</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {words.map((word, index) => (
                        <div key={index} className="flex bg-[#2b1f1f] border border-[#3b2b2b] rounded-md overflow-hidden">
                            <div className="w-10 bg-[#3b2b2b] flex items-center justify-center text-stone-500 font-medium border-r border-[#3b2b2b] select-none text-sm shrink-0">
                                {index + 1}
                            </div>
                            <div className="px-4 py-3 font-mono text-[15px] text-stone-100 font-medium flex-1">
                                {word}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={copyToClipboard}
                        className={`flex items-center px-6 py-2 rounded-md transition-colors text-sm font-medium ${isCopying ? 'bg-rose-600 text-stone-100' : 'bg-[#3b2b2b] hover:bg-[#4d3939] text-stone-300 hover:text-stone-100'}`}
                    >
                        {isCopying ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {isCopying ? "Copied!" : "Copy passphrase"}
                    </button>
                    <button
                        onClick={generatePhrase}
                        className="flex items-center px-6 py-2 bg-rose-600 hover:bg-rose-500 text-stone-100 rounded-md transition-colors text-sm font-medium shadow-sm"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Generate new
                    </button>
                </div>
            </div>
        </div>
    )
}
