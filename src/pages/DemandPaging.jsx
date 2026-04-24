import { useState } from "react"
import { textbookExamples } from "../data/examples"
import Popup from "../components/Popup"
export default function DemandPaging() {

    const [input, setInput] = useState("")
    const [frames, setFrames] = useState("")
    const [step, setStep] = useState(0)
    const [popup, setPopup] = useState("")
    const ref = input.split(",").map(Number)
    const frameCount = Number(frames)
    let memory = new Array(frameCount).fill(null)
    let log = []
    for (let i = 0; i <= step && i < ref.length; i++) {
        const page = ref[i]
        let hit = false
        for (let j = 0; j < frameCount; j++) {
            if (memory[j] === page) {

                hit = true
            }
        }
        if (hit) {
            log.push({
                page,
                type: "hit",
                message: `Page ${page} already exists in memory → no disk access required.`
            })
        }
        else {
            const emptyIndex = memory.indexOf(null)
            if (emptyIndex !== -1) {
                memory[emptyIndex] = page
                log.push({
                    page,
                    type: "fault",
                    message: `Page fault occurred. Page ${page} loaded from disk into frame ${emptyIndex}.`
                })
            }
            else {
                log.push({
                    page,
                    type: "full",
                    message: `Memory is full. Page ${page} cannot be loaded without replacement algorithm.`
                })
            }
        }
    }
    function validateInputs() {

        if (!input.trim()) {
            setPopup("Enter reference string")
            return false
        }

        if (!frameCount || frameCount <= 0) {
            setPopup("Enter valid number of frames")
            return false
        }

        return true
    }
    function next() {
        if (!validateInputs()) return
        if (step < ref.length - 1)
            setStep(step + 1)
    }
    function prev() {
        if (step > 0)
            setStep(step - 1)
    }
    function reset() {
        setStep(0)
        setInput("")
        setFrames("")
    }
    return (
        <div className="w-full space-y-6">
            <Popup message={popup} onClose={() => setPopup("")} />
            <p className="text-xs text-cyan-400 font-semibold tracking-wider">
                MEMORY MANAGEMENT
            </p>
            <h1 className="text-4xl font-bold mt-2">
                Demand Paging
            </h1>
            <p className="text-slate-400 mt-2">
                Pages are loaded only when required. Page fault occurs if page not in memory.
            </p>
            <div className="mt-6 border border-slate-800 rounded-xl p-5 bg-[#020617]">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex flex-col gap-3 flex-1">

                        <div className="flex gap-4 flex-wrap items-center flex-1">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1 bg-transparent border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400"
                                placeholder="Reference String"
                            />
                            <input
                                value={frames}
                                onChange={e => setFrames(e.target.value)}
                                className="w-20 bg-transparent border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400"
                                placeholder="Frames"
                            />
                        </div>

                        <div>
                            <p className="label mb-2">Examples</p>
                            <div className="flex flex-wrap gap-2">
                                {textbookExamples.map((ex, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(ex.data)
                                            setFrames(String(ex.frames))
                                            setStep(0)
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
                    </div>
                    <div className="flex justify-center lg:justify-end items-start">
                        <button className="btn-outline">
                            Reset
                        </button>
                    </div>
                </div>
                <div className="mt-6 border border-slate-800 rounded-xl p-5 bg-[#020617]">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 items-center">
                        <div className="text-sm text-slate-400">
                            Step {step + 1} of {ref.length}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={prev}
                                className="border border-slate-700 px-3 py-1 rounded text-sm"
                            >
                                prev
                            </button>
                            <button
                                onClick={next}
                                className="bg-cyan-400 text-black px-3 py-1 rounded text-sm"
                            >
                                next
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 border border-slate-800 rounded-xl p-6 bg-[#020617]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
                        {/* CPU */}
                        <div className="flex flex-col items-center">
                            <div className="text-xs text-slate-400 mb-2">
                                CPU
                            </div>
                            <div className={
                                "w-14 h-14 flex items-center justify-center rounded-lg border " +
                                (log[step]?.type === "fault"
                                    ? "border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.7)]"
                                    : "border-slate-700")
                            }>
                                ⚙️
                            </div>
                        </div>
                        {/* arrow cpu->disk */}
                        <div className="w-full sm:flex-1 flex justify-center">
                            <div className={
                                "h-1 w-24 rounded " +
                                (log[step]?.type === "fault"
                                    ? "bg-red-400 animate-pulse"
                                    : "bg-slate-700")
                            } />
                        </div>
                        {/* disk */}
                        <div className="flex flex-col items-center">
                            <div className="text-xs text-slate-400 mb-2">
                                Disk
                            </div>
                            <div className={
                                "w-14 h-14 flex items-center justify-center rounded-full border " +
                                (log[step]?.type === "fault"
                                    ? "border-red-400 shadow-[0_0_25px_rgba(248,113,113,0.9)] animate-spin"
                                    : "border-slate-700")
                            }>
                                💿
                            </div>
                        </div>
                        {/* arrow disk->memory */}
                        <div className="flex-1 flex justify-center">
                            <div className={
                                "h-1 w-24 rounded " +
                                (log[step]?.type === "fault"
                                    ? "bg-cyan-400 animate-pulse"
                                    : "bg-slate-700")
                            } />
                        </div>
                        {/* memory */}
                        <div className="flex flex-col items-center">
                            <div className="text-xs text-slate-400 mb-2">
                                Memory
                            </div>
                            <div className={
                                "w-14 h-14 flex items-center justify-center rounded-full border text-lg " +
                                (log[step]?.type === "fault"
                                    ? "border-red-400 animate-spin"
                                    : "border-slate-700")
                            }>
                                {log[step]?.type === "fault"
                                    ? log[step]?.page
                                    : "💿"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    <div className="border border-slate-800 rounded-xl p-5 bg-[#020617]">
                        <p className="text-sm text-slate-400">
                            CPU reference string
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {ref.map((p, i) => (
                                <div
                                    key={i}
                                    className={
                                        i === step
                                            ? "bg-cyan-400 text-black w-7 h-7 text-xs sm:w-8 sm:h-8 sm:text-sm flex items-center justify-center rounded shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-500 scale-110"
                                            : "bg-slate-800 w-7 h-7 text-xs sm:w-8 sm:h-8 sm:text-sm flex items-center justify-center rounded transition-all"
                                    }
                                >
                                    {p}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border border-slate-800 rounded-xl p-5 bg-[#020617]">
                        <p className="text-sm text-slate-400">
                            physical memory
                        </p>
                        <div className="mt-3 space-y-2">
                            {memory.map((m, i) => {
                                const isNewLoad =
                                    log[step]?.type === "fault" &&
                                    memory[i] === log[step]?.page
                                return (
                                    <div
                                        key={i}
                                        className={
                                            isNewLoad
                                                ? "bg-slate-800 px-3 py-2 rounded flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 border border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-500"
                                                : "bg-slate-800 px-3 py-2 rounded flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 border border-transparent"
                                        }
                                    >
                                        <span>
                                            frame {i}
                                        </span>
                                        <span
                                            className={
                                                isNewLoad
                                                    ? "text-cyan-400 font-semibold animate-pulse"
                                                    : "text-white"
                                            }
                                        >
                                            {m ?? "-"}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="border border-slate-800 rounded-xl p-5 bg-[#020617]">
                        <p className="text-sm text-slate-400">
                            step explanation
                        </p>
                        <div className="mt-3 text-sm transition-all duration-500">
                            {log[step]?.type === "hit" &&
                                <span className="text-green-400 animate-pulse">
                                    {log[step].message}
                                </span>
                            }
                            {log[step]?.type === "fault" &&
                                <span className="text-red-400 animate-pulse">
                                    {log[step].message}
                                </span>
                            }
                            {log[step]?.type === "full" &&
                                <span className="text-yellow-400 animate-pulse">
                                    {log[step].message}
                                </span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}