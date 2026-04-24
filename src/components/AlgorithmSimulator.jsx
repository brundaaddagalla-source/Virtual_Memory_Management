import { useState, useEffect, useRef } from "react"
import { textbookExamples } from "../data/examples"
import Popup from "../components/Popup"
import { parseRef, parseFrames } from "../utils/validation"


export default function AlgorithmSimulator({ title, algorithm, notes }) {

    const [score, setScore] = useState(0)
    const [total, setTotal] = useState(0)
    const [refString, setRefString] = useState("")
    const [framesCount, setFramesCount] = useState("")
    const [trace, setTrace] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [popup, setPopup] = useState("")
    const [prediction, setPrediction] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const [playing, setPlaying] = useState(false)
    const timer = useRef(null)
    function handleCheckAnswer() {

        const correct = prediction === actual

        setTotal(prev => prev + 1)
        if (correct) setScore(prev => prev + 1)

        setShowAnswer(true)
    }

    function validateInputs() {

        const refResult = parseRef(refString)
        if (refResult.error) {
            setPopup(refResult.error)
            return null
        }

        const frameResult = parseFrames(framesCount)
        if (frameResult.error) {
            setPopup(frameResult.error)
            return null
        }

        // ✅ NOW safe to use
        if (refResult.ref.length > 200) {
            setPopup("Reference string too long (max 200)")
            return null
        }

        if (frameResult.frameCount === 0) {
            setPopup("Frames must be greater than 0")
            return null
        }

        return {
            ref: refResult.ref,
            frameCount: frameResult.frameCount
        }
    }

    function generateTrace(valid) {
        const result = algorithm(valid.ref, valid.frameCount)
        setTrace(result)
        return result
    }

    function buildTrace() {

        const valid = validateInputs()
        if (!valid) return

        const result = generateTrace(valid)
        setCurrentStep(result.length - 1)
        setPlaying(false)
        setPrediction(null)
        setShowAnswer(false)
    }

    function step() {

        const valid = validateInputs()
        if (!valid) return

        // ✅ FIX: use local result immediately
        if (trace.length === 0) {
            const result = algorithm(valid.ref, valid.frameCount)
            setTrace(result)
            setCurrentStep(0)
            return
        }

        setCurrentStep(prev => {
            if (prev >= trace.length - 1) {
                return prev
            }
            return prev + 1
        })
    }

    function autoplay() {

        const valid = validateInputs()
        if (!valid) return

        if (trace.length === 0) {
            const result = generateTrace(valid)
            setCurrentStep(0)
        }

        if (playing) return
        setPlaying(true)
    }

    function pause() {
        setPlaying(false)
    }

    function reset() {
        if (timer.current) {
            clearInterval(timer.current)
            timer.current = null
        }

        setTrace([])
        setCurrentStep(0)
        setPlaying(false)
        setRefString("")
        setFramesCount("")
        setPrediction(null)
        setShowAnswer(false)
        setScore(0)
        setTotal(0)
    }
    useEffect(() => {
        setPrediction(null)
        setShowAnswer(false)
    }, [currentStep])
    useEffect(() => {
        if (!playing) return

        timer.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= trace.length - 1) {
                    setPlaying(false)
                    return prev
                }
                return prev + 1
            })
        }, 700)

        return () => {
            if (timer.current) {
                clearInterval(timer.current)
                timer.current = null
            }
        }

    }, [playing, trace])

    useEffect(() => {
        if (timer.current) {
            clearInterval(timer.current)
            timer.current = null
        }

        setPlaying(false)
        setTrace([])
        setCurrentStep(0)

    }, [refString, framesCount])

    /* SAFE DATA */

    const refs =
        refString.trim() === ""
            ? []
            : refString
                .split(",")
                .map(n => Number(n.trim()))
                .filter(n => !Number.isNaN(n))

    const frameCount =
        trace[0]?.frames?.length ||
        (Number(framesCount) > 0 ? Number(framesCount) : 0)

    const stepData = trace[currentStep] || {}
    const event = stepData.events?.[0]
    const next = trace[currentStep + 1]
    const actual = next?.events?.[0]?.type
    const hitRate =
        trace.length === 0
            ? 0
            : ((stepData.hits / (stepData.hits + stepData.faults)) * 100).toFixed(1)

    /* 🧠 SMART ANALYTICS */

    const history = trace.slice(0, currentStep + 1)
    const hits = history.filter(s => s.events?.[0]?.type === "hit").length
    const faults = history.length - hits

    let reuseDistance = 0
    let lastSeen = {}

    refs.forEach((p, i) => {
        if (lastSeen[p] !== undefined) {
            reuseDistance += i - lastSeen[p]
        }
        lastSeen[p] = i
    })

    const avgReuse = refs.length ? reuseDistance / refs.length : 0


    return (
        <div className="w-full">

            <Popup message={popup} onClose={() => setPopup("")} />

            <p className="text-xs text-purple-400 mb-2 tracking-widest">
                PAGE REPLACEMENT
            </p>

            <h1 className="text-2xl font-semibold mb-2">{title}</h1>

            <p className="text-slate-400 mb-6">
                Observe how memory evolves step-by-step.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_320px] gap-4 w-full">

                {/* LEFT PANEL */}
                <div className="space-y-4">
                    <div className="card">

                        <p className="label">Reference string</p>

                        <input
                            value={refString}
                            onChange={e => setRefString(e.target.value)}
                            className="input"
                            placeholder="Reference String (eg: 1,2,3)"
                        />

                        <p className="label mt-4">Number of frames</p>

                        <input
                            type="number"
                            value={framesCount}
                            onChange={e => setFramesCount(e.target.value)}
                            className="input"
                            placeholder="Total Frames"
                        />

                        <p className="label mt-4">Examples</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {textbookExamples.map((ex, i) => (
                                <button
                                    key={ex.name}
                                    onClick={() => {
                                        setRefString(ex.data)
                                        setFramesCount(String(ex.frames))
                                        setTrace([])
                                        setCurrentStep(0)
                                    }}
                                    className="chip"
                                >
                                    {ex.name}
                                </button>
                            ))}
                        </div>

                        <div className="text-xs text-slate-400 mt-2">
                            {textbookExamples.find(e => e.data === refString)?.note}
                        </div>

                        <div className="grid grid-cols-2 sm:flex flex-wrap gap-2 mt-4 mb-4">
                            <button
                                onClick={buildTrace}
                                disabled={!refString || !framesCount}
                                className={`btn-primary ${!refString || !framesCount ? "opacity-50 cursor-not-allowed" : ""}`}
                            >Build trace</button>
                            <button
                                onClick={step}
                                disabled={
                                    !refString || !framesCount ||
                                    (prediction !== null && !showAnswer) ||
                                    playing
                                }
                                className={`btn ${!refString || !framesCount || (prediction !== null && !showAnswer) || playing
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    }`}
                            >Step →</button>
                            <button
                                onClick={autoplay}
                                disabled={!refString || !framesCount}
                                className={`btn ${!refString || !framesCount ? "opacity-50 cursor-not-allowed" : ""}`}
                            >Autoplay</button>
                            <button
                                onClick={pause}
                                disabled={!refString || !framesCount || !playing}
                                className={`btn ${!refString || !framesCount || !playing
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    }`}
                            >
                                Pause
                            </button>
                            <button
                                onClick={reset}
                                disabled={!refString || !framesCount}
                                className={`btn-outline ${!refString || !framesCount
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    }`}
                            >
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                            <div className="metric">
                                <p>FAULTS</p>
                                <h2 className="text-red">{stepData.faults || 0}</h2>
                            </div>
                            <div className="metric">
                                <p>HITS</p>
                                <h2 className="text-green">{stepData.hits || 0}</h2>
                            </div>
                        </div>

                        <div className="metric mt-3">
                            <p>HIT RATE</p>
                            <h2 className="text-cyan-300">{hitRate}%</h2>
                        </div>

                    </div>
                </div>


                {/* CENTER PANEL */}
                <div className="space-y-4">
                    {trace.length === 0 && (
                        <p className="text-slate-500 text-sm">
                            Enter input and click "Build trace" to start simulation
                        </p>
                    )}
                    <div className="card sectionGlow">
                        <p className="label">REFERENCE STRING</p>
                        <div className="flex gap-2 flex-wrap">
                            {refs.map((n, i) => (
                                <div key={`ref-${i}`} className={`cell text-xs sm:text-sm ${i === currentStep ? "activeCell scale-110 ring-2 ring-cyan-400" : ""}`}>
                                    {n}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card sectionGlow">
                        <p className="label">MEMORY FRAMES</p>
                        <div className="flex gap-2 sm:gap-4 flex-wrap">
                            {Array(frameCount).fill(0).map((_, i) => {

                                const value = stepData.frames?.[i]
                                const prev = trace[currentStep - 1]?.frames?.[i]

                                return (
                                    <div
                                        key={`frame-${i}-${value}`}
                                        className={`
frameBox
${value !== prev ? "popAnim" : ""}
${event?.frameIndex === i && event?.type === "hit" ? "hitFrame" : ""}
${event?.frameIndex === i && event?.type === "fault" ? "faultFrame" : ""}
`}
                                    >
                                        {value ?? "*"}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="card sectionGlow">
                        <p className="label">STEP HISTORY</p>

                        <div className="max-h-[420px] overflow-auto overflow-x-auto">

                            <table className="table">
                                <tbody>
                                    {Array(frameCount).fill(0).map((_, row) => (
                                        <tr key={`row-${row}`}>
                                            {refs.map((_, col) => {
                                                if (col > currentStep)
                                                    return <td key={`cell-${row}-${col}`} className="tableCell">*</td>

                                                const value = trace[col]?.frames?.[row]
                                                const type = trace[col]?.events?.[0]?.type

                                                return (
                                                    <td
                                                        key={`cell-${row}-${col}`}
                                                        className={`tableCell ${type === "hit" ? "hitCell" : ""} ${type === "fault" ? "faultCell" : ""}`}
                                                    >
                                                        {value ?? "*"}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex gap-[2px] sm:gap-1 mt-2 overflow-x-auto">
                                {refs.map((_, i) => {

                                    if (i > currentStep) {
                                        return (
                                            <div key={`result-${i}`} className="w-[38px] text-center text-slate-600 text-xs">
                                                *
                                            </div>
                                        )
                                    }

                                    const type = trace[i]?.events?.[0]?.type

                                    return (
                                        <div
                                            key={`result-${i}`}
                                            className="min-w-[28px] sm:min-w-[39px] text-center text-[10px] sm:text-xs font-semibold flex-shrink-0 ..."
                                        >
                                            {type === "hit" ? "H" : "F"}
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>


                </div>

                {/* RIGHT PANEL */}
                <div className="space-y-4 xl:sticky xl:top-4 h-fit self-start">

                    <div className="card sectionGlow">

                        <div className="label text-cyan-300">CURRENT STEP</div>

                        <p><span className="text-cyan-300 font-semibold">Observation:</span> {stepData.explanation?.observation}</p>
                        <p><span className="text-purple font-semibold">Reason:</span> {stepData.explanation?.reasoning}</p>
                        <p><span className="text-yellow font-semibold">Action:</span> {stepData.explanation?.action}</p>

                        <p>
                            <span className="text-slate-400 font-semibold">Result:</span>
                            <span className={stepData.explanation?.result === "HIT" ? "text-green ml-2 font-semibold" : "text-red ml-2 font-semibold"}>
                                {stepData.explanation?.result}
                            </span>
                        </p>


                    </div>
                    <div className="card sectionGlow mt-4">

                        <div className="label text-pink-400">PREDICT NEXT STEP</div>

                        {!trace.length || currentStep >= trace.length - 1 ? (
                            <p className="text-slate-400">No next step available</p>
                        ) : (
                            <>
                                <p className="text-xs text-slate-400 mb-2">
                                    Score: {score} / {total}
                                </p>
                                <p className="text-slate-300 mb-3">
                                    What will happen next?
                                </p>

                                <div className="flex gap-2 mb-3">

                                    <button
                                        disabled={showAnswer}
                                        onClick={() => setPrediction("hit")}
                                        className={`btn 
        ${prediction === "hit" ? "ring-2 ring-cyan-400 scale-105" : ""}
        ${prediction === "hit" && !showAnswer ? "bg-green text-black" : ""}
        ${showAnswer && actual === "hit" ? "bg-green- text-white" : ""}
        ${showAnswer && prediction === "hit" && actual !== "hit" ? "bg-red text-white" : ""}
    `}
                                    >
                                        HIT
                                    </button>

                                    <button
                                        disabled={showAnswer}
                                        onClick={() => setPrediction("fault")}
                                        className={`btn 
        ${prediction === "fault" ? "ring-2 ring-cyan-400 scale-105" : ""}
        ${prediction === "fault" && !showAnswer ? "bg-red text-black" : ""}
        ${showAnswer && actual === "fault" ? "bg-green text-white" : ""}
        ${showAnswer && prediction === "fault" && actual !== "fault" ? "bg-red text-white" : ""}
    `}
                                    >
                                        FAULT
                                    </button>
                                </div>

                                <button
                                    onClick={handleCheckAnswer}
                                    className="btn-primary"
                                    disabled={!prediction}
                                >
                                    Check Answer
                                </button>

                                {showAnswer && (
                                    <div className="mt-3 text-sm">
                                        <p className={prediction === actual ? "text-green-400" : "text-red-400"}>
                                            {prediction === actual ? "Correct 🎯" : "Wrong ❌"}
                                        </p>
                                        <p className="text-slate-300">
                                            Actual: {actual?.toUpperCase()}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setPrediction(null)
                                                setShowAnswer(false)
                                                setCurrentStep(prev => Math.min(prev + 1, trace.length - 1))
                                            }}
                                            className="btn mt-3"
                                        >
                                            Next Step →
                                        </button>
                                    </div>

                                )}


                            </>
                        )}

                    </div>

                    {/* SMART OBSERVE */}
                    <div className="card sectionGlow mt-4">

                        <div className="label text-green-400">WHAT TO OBSERVE</div>

                        {trace.length === 0 ? (
                            <p className="text-slate-400">Run simulation to see insights</p>
                        ) : event?.type === "hit" ? (
                            <p className="text-slate-300">
                                This is a hit. So far: {hits} hits vs {faults} faults.
                                This indicates {hits > faults ? "strong" : "weak"} locality.
                            </p>
                        ) : (
                            <p className="text-slate-300">
                                A fault occurred. Focus on which page was removed and why.
                            </p>
                        )}

                    </div>

                    {/* PATTERN */}
                    <div className="card sectionGlow mt-4">

                        <div className="label text-yellow-400">PATTERN INSIGHT</div>

                        {refs.length === 0 ? null : avgReuse < frameCount ? (
                            <p className="text-slate-300">
                                Strong locality → LRU / Optimal perform better.
                            </p>
                        ) : (
                            <p className="text-slate-300">
                                Weak locality → frequent faults expected.
                            </p>
                        )}

                    </div>

                    {/* NOTES SAME */}

                    {/* KEY TAKEAWAY */}
                    <div className="card sectionGlow mt-4">

                        <div className="label text-cyan-300">KEY TAKEAWAY</div>

                        {trace.length > 0 && (() => {
                            const total = stepData.hits + stepData.faults
                            const ratio = total ? stepData.hits / total : 0

                            if (ratio > 0.7)
                                return <p className="text-slate-300">Excellent locality — very efficient.</p>

                            if (ratio > 0.4)
                                return <p className="text-slate-300">Moderate locality — algorithm choice matters.</p>

                            return <p className="text-slate-300">Poor locality — high fault rate.</p>
                        })()}

                    </div>

                </div>

            </div>

        </div>
    )
}