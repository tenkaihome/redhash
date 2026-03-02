"use client"

import { useState } from "react"
import { Heart, Copy, Check, Lock, Unlock } from "lucide-react"
import CryptoJS from "crypto-js"

export default function EncryptDecrypt() {
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
    const [text, setText] = useState("")
    const [secret, setSecret] = useState("")
    const [result, setResult] = useState("")
    const [isCopying, setIsCopying] = useState(false)

    const handleProcess = () => {
        if (!text || !secret) {
            setResult("")
            return
        }
        try {
            if (mode === "encrypt") {
                const encrypted = CryptoJS.AES.encrypt(text, secret).toString()
                setResult(encrypted)
            } else {
                const decryptedBytes = CryptoJS.AES.decrypt(text, secret)
                const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8)
                if (!decryptedString) {
                    setResult("Error: Invalid secret key or malformed ciphertext.")
                } else {
                    setResult(decryptedString)
                }
            }
        } catch {
            setResult("An error occurred during processing.")
        }
    }

    const copyToClipboard = () => {
        if (!result || result.startsWith("Error")) return
        if (navigator.clipboard) {
            navigator.clipboard.writeText(result)
                .then(() => {
                    setIsCopying(true)
                    setTimeout(() => setIsCopying(false), 2000)
                })
                .catch(() => fallbackCopy(result))
        } else {
            fallbackCopy(result)
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

    return (
        <div className="max-w-4xl mx-auto py-8 text-stone-300">
            <div className="flex justify-between items-start mb-6">
                <div className="relative w-full border-b border-[#2b1f1f] pb-3">
                    <h1 className="text-4xl font-semibold text-stone-100 inline-block relative">
                        Encrypt / decrypt text
                        <div className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-rose-600"></div>
                    </h1>
                    <button className="absolute right-0 top-2 text-stone-500 hover:text-stone-100 transition-colors">
                        <Heart className="w-5 h-5 fill-current" />
                    </button>
                </div>
            </div>

            <p className="text-stone-400 mb-8 max-w-3xl text-[15px] leading-relaxed">
                Encrypt and decrypt text data with AES encryption algorithm using a secret key.
            </p>

            <div className="bg-[#1c1414] border border-[#2b1f1f] rounded-md p-6 sm:p-8 shadow-sm">

                <div className="flex space-x-1 mb-6 bg-[#2b1f1f] p-1 rounded-md w-fit">
                    <button
                        onClick={() => { setMode("encrypt"); setResult(""); setText(""); }}
                        className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "encrypt" ? "bg-[#3b2b2b] text-stone-100 shadow-sm" : "text-stone-400 hover:text-stone-100"}`}
                    >
                        <Lock className="w-4 h-4 mr-2" />
                        Encrypt
                    </button>
                    <button
                        onClick={() => { setMode("decrypt"); setResult(""); setText(""); }}
                        className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "decrypt" ? "bg-[#3b2b2b] text-stone-100 shadow-sm" : "text-stone-400 hover:text-stone-100"}`}
                    >
                        <Unlock className="w-4 h-4 mr-2" />
                        Decrypt
                    </button>
                </div>

                <div className="flex flex-col gap-6 mb-6">
                    <div>
                        <label className="block text-[15px] text-stone-300 mb-2">
                            {mode === "encrypt" ? "Text to encrypt" : "Ciphertext to decrypt"}
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={mode === "encrypt" ? "Plain text..." : "U2FsdGVkX1..."}
                            className="w-full bg-[#2b1f1f] border border-transparent outline-none rounded-md px-4 py-3 text-stone-100 placeholder:text-stone-500 min-h-[100px] resize-y focus:border-[#4dbb9c] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-[15px] text-stone-300 mb-2">Secret Key</label>
                        <input
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            placeholder="Your secret key..."
                            className="w-full bg-[#2b1f1f] border border-transparent outline-none rounded-md px-4 py-3 text-stone-100 placeholder:text-stone-500 focus:border-[#4dbb9c] transition-colors"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleProcess}
                            disabled={!text || !secret}
                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-stone-100 rounded-md transition-colors text-sm font-medium shadow-sm w-full font-semibold disabled:bg-rose-600/30 disabled:text-stone-400 disabled:cursor-not-allowed"
                        >
                            {mode === "encrypt" ? "Encrypt text" : "Decrypt text"}
                        </button>
                    </div>

                    {result && (
                        <div className="mt-4 border-t border-[#2b1f1f] pt-6">
                            <label className="block text-[15px] text-stone-300 mb-2">Result:</label>
                            <div className="relative">
                                <textarea
                                    value={result}
                                    readOnly
                                    className={`w-full bg-[#2b1f1f] border ${result.startsWith("Error") ? "border-red-500/50 text-red-400" : "border-[#2b1f1f] text-stone-300"} outline-none rounded-md px-4 py-3 min-h-[100px] resize-y font-mono text-[14px]`}
                                />
                                {!result.startsWith("Error") && (
                                    <button
                                        onClick={copyToClipboard}
                                        className={`absolute top-2 right-2 p-2 rounded-md bg-[#2b1f1f] transition-colors ${isCopying ? 'text-[#4dbb9c] bg-rose-600/10' : 'text-stone-400 hover:text-stone-100 hover:bg-[#4d3939]'}`}
                                    >
                                        {isCopying ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
