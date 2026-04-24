import { useState, useEffect, useRef } from "react"
import MethodDropdown from "../components/MethodDropdown"
import { allocationSteps } from "../algorithms/allocation"
import Popup from "../components/Popup"

export default function Allocation() {
    const [popup, setPopup] = useState("")
    const [frames, setFrames] = useState("")
    const [method, setMethod] = useState("proportional")

    const [processes, setProcesses] = useState([
        { id: Date.now(), size: "", priority: "" }
    ])

    const [trace, setTrace] = useState([])
    const [currentStep, setCurrentStep] = useState(0)

    const [playing, setPlaying] = useState(false)
    const timer = useRef(null)

    const stepData = trace[currentStep] || {}

    /* ================= VALIDATION ================= */

    function getCleanProcesses() {

        if (!frames || isNaN(frames) || frames <= 0) {
            setPopup("Enter valid frame count")
            return null
        }

        for (let p of processes) {

            if (method !== "priority") {
                if (p.size === "" || isNaN(p.size)) {
                    setPopup("Enter valid process sizes")
                    return null
                }
            }

            if (method === "priority") {
                if (p.priority === "" || isNaN(p.priority)) {
                    setPopup("Enter valid priorities")
                    return null
                }
            }
        }

        return processes.map(p => ({
            size: method === "proportional" ? Number(p.size) : 0,
            priority: method === "priority" ? Number(p.priority) : 0
        }))
    }

    /* ================= BUILD ================= */

    function buildTrace() {

        const clean = getCleanProcesses()
        if (!clean) return

        const result = allocationSteps(clean, frames, method)

        setTrace(result)
        setCurrentStep(result.length - 1)
        setPlaying(false)
    }

    /* ================= STEP ================= */

    function step() {

        const clean = getCleanProcesses()
        if (!clean) return

        if (trace.length === 0) {

            const result = allocationSteps(clean, frames, method)
            setTrace(result)
            setCurrentStep(0)
            return
        }

        if (currentStep < trace.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    /* ================= AUTOPLAY ================= */

    function autoplay() {

        const clean = getCleanProcesses()
        if (!clean) return

        if (trace.length === 0) {
            const result = allocationSteps(clean, frames, method)
            setTrace(result)
            setCurrentStep(0)
        }

        setPlaying(true)
    }

    function pause() {
        setPlaying(false)
    }

    /* ================= RESET ================= */

    function reset() {
        clearInterval(timer.current)

        // clear simulation
        setTrace([])
        setCurrentStep(0)
        setPlaying(false)

        // clear inputs
        setFrames("")
        setProcesses([
            { id: Date.now(), size: "", priority: "" }
        ])
    }

    /* ================= AUTO EFFECT ================= */

    useEffect(() => {

        if (!playing || trace.length === 0) return

        timer.current = setInterval(() => {

            setCurrentStep(prev => {

                if (prev >= trace.length - 1) {
                    setPlaying(false)
                    return prev
                }

                return prev + 1
            })

        }, 500)

        return () => clearInterval(timer.current)

    }, [playing, trace])

    /* ================= PROCESS HANDLING ================= */

    function updateProcess(index, field, value) {

        const arr = [...processes]
        arr[index][field] = value === "" ? "" : Number(value)
        setProcesses(arr)
    }

    function addProcess() {
        setProcesses([
            ...processes,
            { id: Date.now() + Math.random(), size: "", priority: "" }
        ])
    }

    function removeProcess(i) {
        setProcesses(processes.filter((_, idx) => idx !== i))
    }

    /* ================= NOTES ================= */

    const allocationNotes = {
        equal: [
            { label: "Rule", text: "Each process receives equal frames.", color: "text-cyan-300" },
            { label: "How it works", text: "Frames are divided evenly regardless of size.", color: "text-purple" },
            { label: "Example", text: "12 frames, 3 processes → each gets 4.", color: "text-yellow" },
            { label: "Formula", text: "Frames = (Process Size / Total Size) × Total Frames", color: "text-pink-300" },
            { label: "Pros", text: "Simple and fair.", color: "text-green" },
            { label: "Cons", text: "Ignores process size.", color: "text-red" }
        ],
        proportional: [
            { label: "Rule", text: "Frames based on process size.", color: "text-cyan-300" },
            { label: "How it works", text: "Larger processes get more frames.", color: "text-purple" },
            { label: "Example", text: "[10,20,30] → [2,4,6]", color: "text-yellow" },
            { label: "Formula", text: "Frames = (Process Size / Total Size) × Total Frames", color: "text-pink-300" },
            { label: "Pros", text: "Efficient memory usage.", color: "text-green" },
            { label: "Cons", text: "Small processes get fewer frames.", color: "text-red" }
        ],
        priority: [
            { label: "Rule", text: "Frames based on priority.", color: "text-cyan-300" },
            { label: "How it works", text: "Higher priority gets more frames.", color: "text-purple" },
            { label: "Example", text: "[4,3,2,1] → [5,4,2,1]", color: "text-yellow" },
            { label: "Formula", text: "Frames = (Process Size / Total Size) × Total Frames", color: "text-pink-300" },
            { label: "Pros", text: "Important processes perform better.", color: "text-green" },
            { label: "Cons", text: "Low priority may starve.", color: "text-red" }
        ]
    }
    let dynamicCalculation = ""

    /* ================= PROPORTIONAL ================= */
    if (method === "proportional") {

        const sizes = processes.map(p => Number(p.size))
        const total = sizes.reduce((a, b) => a + b, 0)

        if (total > 0) {

            dynamicCalculation += `Total size = ${total}\n\n`

            let base = []
            let fractions = []

            sizes.forEach((s, i) => {
                const exact = (s / total) * frames
                const floor = Math.floor(exact)

                base.push(floor)
                fractions.push({ i, frac: exact - floor })

                dynamicCalculation += `P${i + 1} = (${s}/${total}) × ${frames} = ${exact.toFixed(2)} → ${floor}\n`
            })

            let used = base.reduce((a, b) => a + b, 0)
            let remaining = frames - used

            dynamicCalculation += `\nRemaining = ${remaining}\n`

            fractions.sort((a, b) => b.frac - a.frac)

            for (let i = 0; i < remaining; i++) {
                base[fractions[i].i]++
                dynamicCalculation += `Extra → Process ${fractions[i].i + 1}\n`
            }

            dynamicCalculation += `\n\nFinal Allocation:\n[${base.join(", ")}]`
        }
    }

    /* ================= PRIORITY ================= */
    else if (method === "priority") {

        const priorities = processes.map(p => Number(p.priority))
        const total = priorities.reduce((a, b) => a + b, 0)

        if (total <= 0) {
            dynamicCalculation = "Enter valid priority values"
        } else {

            dynamicCalculation += `Total priority = ${total}\n\n`

            let base = []
            let fractions = []

            priorities.forEach((p, i) => {

                const exact = (p / total) * Number(frames)
                const floor = Math.floor(exact)

                base.push(floor)
                fractions.push({ index: i, frac: exact - floor })

                dynamicCalculation += `P${i + 1} = (${p}/${total}) × ${frames} = ${exact.toFixed(2)} → ${floor}\n`
            })

            let used = base.reduce((a, b) => a + b, 0)
            let remaining = Number(frames) - used

            dynamicCalculation += `\nRemaining = ${remaining}\n`

            fractions.sort((a, b) => b.frac - a.frac)

            for (let i = 0; i < remaining; i++) {

                base[fractions[i].index]++   // ✅ IMPORTANT

                dynamicCalculation += `Extra → Process ${fractions[i].index + 1}\n`
            }

            /* ✅ THIS IS WHAT YOU WERE MISSING */
            dynamicCalculation += `\n\nFinal Allocation:\n[${base.join(", ")}]`
        }
    }

    /* ================= EQUAL ================= */
    else if (method === "equal") {

        const n = processes.length

        if (n > 0) {

            const each = Math.floor(frames / n)
            const rem = frames % n

            dynamicCalculation += `Each process = ${frames}/${n} = ${each}\n`
            dynamicCalculation += `Remaining = ${rem}\n\n`

            let result = Array(n).fill(each)

            for (let i = 0; i < rem; i++) {
                result[i]++
            }

            dynamicCalculation += `\nFinal Allocation:\n[${result.join(", ")}]`
        }
    }
    /* ================= UI ================= */

    return (
        <div className="w-full">
            <Popup message={popup} onClose={() => setPopup("")} />

            <div className="mb-6">
                <p className="text-xs tracking-widest text-slate-400">
                    MEMORY ALLOCATION
                </p>
                <h1 className="text-3xl font-semibold mt-2">
                    Frame Allocation Simulator
                </h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_320px] gap-6">

                {/* LEFT PANEL */}
                <div className="card sectionGlow">

                    <p className="label">INPUT</p>

                    <input
                        type="number"
                        value={frames}
                        onChange={e => setFrames(Number(e.target.value))}
                        className="input mb-3"
                        placeholder="Total Frames"
                    />

                    <MethodDropdown method={method} setMethod={setMethod} />

                    <div className="mt-4">

                        <p className="text-xs text-slate-400 mb-2">Processes</p>

                        {processes.map((p, i) => (
                            <div key={p.id} className="flex gap-2 mb-2">

                                {/* SIZE ONLY for proportional/equal */}
                                {/* SIZE → ALWAYS visible */}
                                <input
                                    type="number"
                                    value={p.size}
                                    onChange={(e) => updateProcess(i, "size", e.target.value)}
                                    className="input"
                                    placeholder="Size"
                                />

                                {/* PRIORITY → ONLY for priority mode */}
                                {method === "priority" && (
                                    <input
                                        type="number"
                                        value={p.priority}
                                        onChange={(e) => updateProcess(i, "priority", e.target.value)}
                                        className="input"
                                        placeholder="Priority"
                                    />
                                )}

                                <button
                                    onClick={() => removeProcess(i)}
                                    className="text-red"
                                >
                                    ✕
                                </button>

                            </div>
                        ))}

                        {method === "priority" && (
                            <p className="text-xs text-slate-500 mb-2">
                                Higher number = higher priority
                            </p>
                        )}

                        <button
                            onClick={addProcess}
                            className="text-cyan-400 text-sm mt-1"
                        >
                            + Add Process
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                            onClick={buildTrace}
                            disabled={!frames || processes.some(p =>
                                (method !== "priority" && p.size === "") ||
                                (method === "priority" && p.priority === "")
                            )}
                            className={`btn-primary ${!frames || processes.some(p =>
                                (method !== "priority" && p.size === "") ||
                                (method === "priority" && p.priority === "")
                            )
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                        >
                            Build
                        </button>

                        <button
                            onClick={step}
                            disabled={!frames || processes.some(p =>
                                (method !== "priority" && p.size === "") ||
                                (method === "priority" && p.priority === "")
                            ) || playing}
                            className={`btn ${!frames || processes.some(p =>
                                (method !== "priority" && p.size === "") ||
                                (method === "priority" && p.priority === "")
                            ) || playing
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                        >
                            Step →
                        </button>

                        <button
                            onClick={autoplay}
                            disabled={!frames || processes.some(p =>
                                (method !== "priority" && p.size === "") ||
                                (method === "priority" && p.priority === "")
                            ) || playing}
                            className={`btn ${!frames || processes.some(p =>
                                (method !== "priority" && p.size === "") ||
                                (method === "priority" && p.priority === "")
                            ) || playing
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                        >
                            Auto
                        </button>

                        <button
                            onClick={pause}
                            disabled={!playing}
                            className={`btn ${!playing ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            Pause
                        </button>
                        <button
                            onClick={reset}
                            disabled={!frames && processes.length === 1}
                            className={`btn-outline mt-3 ${!frames && processes.length === 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                        >
                            Reset
                        </button>
                    </div>

                </div>

                {/* CENTER PANEL */}
                <div className="card sectionGlow">

                    <p className="label mb-4">ALLOCATION</p>

                    {stepData.allocation?.map((f, i) => (
                        <div key={`process-${i}`} className="mb-4">

                            <p className={`${stepData.active === i ? "glowText" : ""}`}>
                                Process {i + 1}
                            </p>

                            <div className="flex gap-2 flex-wrap">
                                {Array(f).fill(0).map((_, j) => (
                                    <div
                                        key={`frame-${i}-${j}`}
                                        className={`w-8 h-8 rounded bg-cyan-400/80 popAnim ${stepData.active === i ? "glowText" : ""}`}
                                    />
                                ))}
                            </div>

                        </div>
                    ))}

                </div>

                {/* RIGHT PANEL */}
                <div className="card sectionGlow">

                    <div className="label text-purple-400">
                        NOTES & MEMORY TRICKS
                    </div>

                    <ul className="mt-3 space-y-3 text-sm leading-relaxed">

                        {allocationNotes[method].map((item, i) => (
                            <li key={i}>
                                <span className={`font-semibold ${item.color}`}>
                                    {item.label}:
                                </span>
                                <span className="text-slate-300 ml-2">
                                    {item.text}
                                </span>
                            </li>
                        ))}

                        {dynamicCalculation && (
                            <li className="mt-3">
                                <span className="text-teal-600 font-semibold">
                                    Calculation:
                                </span>
                                <pre className="text-slate-300 whitespace-pre-line mt-1">
                                    {dynamicCalculation}
                                </pre>
                            </li>
                        )}

                    </ul>

                </div>

            </div>
        </div>
    )
}