import { useState, useEffect } from "react"
import { fifo } from "../algorithms/fifo"
import { lru } from "../algorithms/lru"
import { optimal } from "../algorithms/optimal"
import { secondChance } from "../algorithms/secondChance"
import { nru } from "../algorithms/nru"
import Popup from "../components/Popup"
import { textbookExamples } from "../data/examples"
import { runAlgorithms } from "../utils/runAlgorithms"
import { parseRef, parseFrames } from "../utils/validation"   // ✅ ADDED

export default function Compare() {

    const [input, setInput] = useState("")
    const [frames, setFrames] = useState("")
    const [data, setData] = useState([])
    const [popup, setPopup] = useState("")
    const [animated, setAnimated] = useState(false)

    const algorithms = [
        { name: "FIFO", fn: fifo },
        { name: "LRU", fn: lru },
        { name: "Optimal", fn: optimal },
        { name: "Second Chance", fn: secondChance },
        { name: "NRU", fn: nru }
    ]

    function run() {

        const refResult = parseRef(input)
        if (refResult.error) {
            setPopup(refResult.error)
            return
        }

        const frameResult = parseFrames(frames)
        if (frameResult.error) {
            setPopup(frameResult.error)
            return
        }

        const { ref } = refResult
        const { frameCount } = frameResult

        const results = runAlgorithms(ref, frameCount, algorithms)

        setAnimated(false)
        setData(results)
    }

    useEffect(() => {
        if (data.length > 0) {
            const t = setTimeout(() => setAnimated(true), 50)
            return () => clearTimeout(t)
        }
    }, [data])

    // ✅ CLEAR OLD RESULTS WHEN INPUT CHANGES
    useEffect(() => {
        setData([])
    }, [input, frames])

    return (
        <div className="w-full space-y-6 px-4 sm:px-6">

            <Popup message={popup} onClose={() => setPopup("")} />

            <p className="text-xs text-cyan-400 font-semibold tracking-wider">
                EXPERIMENT
            </p>

            <h1 className="text-4xl font-bold mt-2 text-white">
                Side-by-side comparison
            </h1>

            <p className="text-slate-400 mt-2">
                Run multiple page replacement algorithms on the same reference string.
            </p>

            <div className="mt-6 border border-slate-800 rounded-xl p-5 bg-[#020617]">

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-4 flex-1">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="flex-1 bg-transparent border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400"
                            placeholder="Reference String (eg: 1,2,3)"
                        />

                        <input
                            value={frames}
                            onChange={e => setFrames(e.target.value)}
                            className="w-full sm:w-20 bg-transparent border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400"
                            placeholder="Frames"
                        />
                    </div>



                    <button
                        onClick={run}
                        disabled={!input || !frames}
                        className={`w-full sm:w-auto px-5 rounded-lg text-sm font-semibold transition ${!input || !frames
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-cyan-400 hover:bg-cyan-300 text-black"
                            }`}
                    >
                        Compare
                    </button>

                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {textbookExamples.map((ex, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setInput(ex.data)
                                setFrames(String(ex.frames))
                                setData([])
                            }}
                            className="chip"
                        >
                            {ex.name}
                        </button>
                    ))}
                </div>

                <p className="text-xs text-slate-400 mt-2">
                    {textbookExamples.find(e => e.data === input)?.note}
                </p>

            </div>

            {data.length > 0 && (
                <>
                    <div className="mt-6 border border-slate-800 rounded-xl p-6 space-y-5 bg-[#020617]">

                        {data.map((a, index) => {
                            const percent = parseFloat(a.rate)

                            return (
                                <div key={a.name}>
                                    <div className="flex justify-between text-sm text-slate-300">
                                        <span>{a.name}</span>
                                        <span>
                                            {a.faults}/{a.result.length} ({a.rate}%)
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-1000 ease-out"
                                            style={{
                                                width: animated ? `${percent}%` : "0%",
                                                transitionDelay: `${index * 150}ms`
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6 border border-slate-800 rounded-xl p-6 bg-[#020617]">

                        <h2 className="text-lg font-semibold mb-4">
                            Result Summary
                        </h2>

                        {(() => {

                            const sorted = [...data].sort((a, b) => a.faults - b.faults)
                            const best = sorted[0]

                            return (
                                <>
                                    <div className="mb-4 p-4 rounded-lg border border-cyan-400 bg-cyan-400/10">
                                        <span className="text-white font-semibold">
                                            {best.name}
                                        </span>{" "}
                                        with{" "}
                                        <span className="text-cyan-400 font-semibold">
                                            {best.faults}
                                        </span>{" "}
                                        page faults ({best.rate}%)
                                    </div>

                                    <div className="space-y-2">
                                        {sorted.map((a, i) => (
                                            <div key={a.name} className="flex justify-between px-3 py-2 rounded bg-slate-800">
                                                <span>{i + 1}. {a.name}</span>
                                                <span className="text-slate-400">
                                                    {a.faults} faults ({a.rate}%)
                                                </span>
                                            </div>
                                        ))}
                                        <div className="mt-5 p-4 rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-300">

                                            {(() => {

                                                const best = [...data].sort((a, b) => a.faults - b.faults)[0]

                                                let message = ""

                                                if (best.name === "Optimal") {
                                                    message = "Optimal performs best because it uses future knowledge and replaces the page that will not be used for the longest time."
                                                }

                                                else if (best.name === "LRU") {
                                                    message = "LRU performs best here because recently used pages tend to be reused, so keeping them reduces page faults."
                                                }

                                                else if (best.name === "FIFO") {
                                                    message = "FIFO performs best here due to this specific access pattern, but it does not consider usage history and can perform poorly in other cases."
                                                }

                                                else if (best.name === "Second Chance") {
                                                    message = "Second Chance performs well by giving recently used pages another chance before replacement, reducing unnecessary faults."
                                                }

                                                else if (best.name === "NRU") {
                                                    message = "NRU performs best by prioritizing removal of pages that were not recently used using reference bits."
                                                }

                                                return (
                                                    <div>
                                                        <span className="text-white font-semibold">
                                                            Why {best.name} performed best:
                                                        </span>
                                                        <p className="mt-2">{message}</p>
                                                    </div>
                                                )

                                            })()}

                                        </div>
                                    </div>
                                </>
                            )
                        })()}

                    </div>
                </>
            )}

        </div>
    )
}