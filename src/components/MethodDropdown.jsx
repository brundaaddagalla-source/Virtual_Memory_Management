import { useState, useRef, useEffect } from "react"

const methods = ["equal", "proportional", "priority"]

export default function MethodDropdown({ method, setMethod }) {

    const [open, setOpen] = useState(false)
    const ref = useRef()

    // close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <div ref={ref} className="relative">

            {/* Selected */}
            <div
                onClick={() => setOpen(!open)}
                className="w-full bg-[#020617] border border-cyan-500/30 
                           text-white rounded-xl px-3 py-2 
                           flex justify-between items-center cursor-pointer
                           hover:border-cyan-400 transition"
            >
                <span className="capitalize">{method}</span>
                <span className={`transition ${open ? "rotate-180" : ""}`}>
                    ▾
                </span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute w-full mt-2 rounded-xl 
                                border border-cyan-500/30 
                                bg-[#020617] backdrop-blur-md 
                                shadow-lg z-50 overflow-hidden">

                    {methods.map((m) => (
                        <div
                            key={m}
                            onClick={() => {
                                setMethod(m)
                                setOpen(false)
                            }}
                            className={`px-3 py-2 cursor-pointer capitalize 
                                hover:bg-cyan-500/10 transition
                                ${method === m ? "text-cyan-300" : "text-white"}
                            `}
                        >
                            {m}
                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}