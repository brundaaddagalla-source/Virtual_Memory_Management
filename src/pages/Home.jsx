import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Home() {
    return (
        <div className="w-full px-6 xl:px-20 py-16">

            <p className="text-xs tracking-[0.25em] text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee,0_0_18px_#22d3ee]"></span>
                VIRTUAL MEMORY • INTERACTIVE LAB
            </p>

            <h1 className="text-7xl font-semibold mt-4 leading-tight">
                Learn memory management
                <br />
                by <span className="text-cyan-400">watching it happen</span>
                <span className="text-slate-500 italic"> — not by reading about it.</span>
            </h1>

            <p className="text-slate-400 mt-6 max-w-xl leading-relaxed">
                Visualize demand paging, replacement algorithms, and frame allocation through interactive simulation.
            </p>

            <div className="flex gap-4 mt-10">

                <Link
                    to="/demand-paging"
                    className="btn btn-primary"
                >
                    Start with Demand Paging
                </Link>

                <Link
                    to="/compare"
                    className="btn"
                >
                    Compare algorithms
                </Link>

                <Link
                    to="/notes"
                    className="btn"
                >
                    Quick notes
                </Link>

            </div>

            <div className="mt-28">

                <p className="text-xs tracking-widest text-cyan-400">LEARNING FLOW</p>

                <h2 className="text-3xl font-semibold mt-3">
                    Recommended order
                </h2>

                <p className="text-slate-400 mt-3 max-w-xl">
                    Understand concepts step-by-step before comparing performance.
                </p>

                <ProgressSummary />

                <div className="mt-14 space-y-12">

                    <PathRow
                        title="Foundation"
                        color="cyan"
                        items={[
                            { label: "Virtual Memory", link: "/" },
                            { label: "Demand Paging", link: "/demand-paging" }
                        ]}
                    />

                    <PathRow
                        title="Replacement Algorithms"
                        color="violet"
                        items={[
                            { label: "FIFO", link: "/fifo" },
                            { label: "LRU", link: "/lru" },
                            { label: "Optimal", link: "/optimal" },
                            { label: "NRU", link: "/nru" },
                            { label: "Second Chance", link: "/second-chance" }
                        ]}
                    />

                    <PathRow
                        title="Frame Allocation"
                        color="yellow"
                        items={[
                            { label: "Equal", link: "/allocation" },
                            { label: "Priority", link: "/allocation" },
                            { label: "Proportional", link: "/allocation" }
                        ]}
                    />

                </div>

            </div>

            <div className="mt-32">

                <p className="text-xs tracking-widest text-cyan-400">SIMULATORS</p>

                <h2 className="text-3xl font-semibold mt-3">
                    Pick a simulator
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                    <SimulatorCard
                        n="01"
                        type="concept"
                        title="Demand Paging"
                        desc="Pages load only when needed. Understand page faults and lazy loading."
                        link="/demand-paging"
                    />

                    <SimulatorCard
                        n="02"
                        type="replacement"
                        title="FIFO"
                        desc="Evict oldest page in memory. Simple but may suffer Belady anomaly."
                        link="/fifo"
                    />

                    <SimulatorCard
                        n="03"
                        type="replacement"
                        title="Optimal (Belady)"
                        desc="Uses future knowledge to minimize faults. The theoretical best."
                        link="/optimal"
                    />

                    <SimulatorCard
                        n="04"
                        type="replacement"
                        title="LRU"
                        desc="Evicts least recently used page. Practical approximation of Optimal."
                        link="/lru"
                    />

                    <SimulatorCard
                        n="05"
                        type="replacement"
                        title="NRU"
                        desc="Groups pages by usage bits. Efficient classification strategy."
                        link="/nru"
                    />

                    <SimulatorCard
                        n="06"
                        type="replacement"
                        title="Second Chance"
                        desc="Improved FIFO using reference bit to avoid premature eviction."
                        link="/second-chance"
                    />

                    <SimulatorCard
                        n="07"
                        type="allocation"
                        title="Frame Allocation"
                        desc="Distribute frames using Equal, Priority or Proportional policies."
                        link="/allocation"
                    />

                    <SimulatorCard
                        n="08"
                        type="dashboard"
                        title="Compare Algorithms"
                        desc="Run multiple algorithms on identical reference strings."
                        link="/compare"
                        btn="open dashboard"
                    />

                </div>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 text-sm">

                <Feature
                    title="STEP MODE"
                    desc="Execute one memory access at a time"
                />

                <Feature
                    title="AUTOPLAY"
                    desc="Smooth animated execution"
                />

                <Feature
                    title="EXAMPLES"
                    desc="Classic OS textbook inputs"
                />

                <Feature
                    title="VISUAL LEARNING"
                    desc="Understand through animation"
                />

            </div>

        </div>
    )
}

function ProgressSummary() {

    const [progress, setProgress] = useState([])

    useEffect(() => {
        setProgress(JSON.parse(localStorage.getItem("vm-progress") || "[]"))
    }, [])

    const total = 10
    const percent = Math.round(progress.length / total * 100)

    return (
        <div className="mt-8">

            <div className="flex justify-between text-sm text-slate-400">
                <span>Progress</span>
                <span>{percent}%</span>
            </div>

            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">

                <div
                    className="h-full bg-cyan-400 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                />

            </div>

        </div>
    )
}

function PathRow({ title, items, color }) {

    const [progress, setProgress] = useState([])

    useEffect(() => {
        setProgress(JSON.parse(localStorage.getItem("vm-progress") || "[]"))
    }, [])

    function toggle(label) {

        let updated

        if (progress.includes(label)) {
            updated = progress.filter(i => i !== label)
        } else {
            updated = [...progress, label]
        }

        setProgress(updated)

        localStorage.setItem("vm-progress", JSON.stringify(updated))
    }

    const colors = {
        cyan: "border-cyan-400 text-cyan-400",
        violet: "border-violet-400 text-violet-400",
        yellow: "border-amber-400 text-amber-400"
    }

    return (
        <div>

            <p className={`text-xs tracking-wider mb-5 ${colors[color]}`}>
                {title}
            </p>

            <div className="flex flex-wrap items-center gap-5">

                {items.map((item, i) => {

                    const done = progress.includes(item.label)

                    return (

                        <div key={i} className="flex items-center gap-5">

                            <div className="relative">

                                <Link
                                    to={item.link}
                                    onClick={() => toggle(item.label)}
                                    className={`px-5 py-3 rounded-xl border bg-[#020617] font-medium transition hover:scale-105 ${colors[color]} ${done ? "shadow-[0_0_18px_rgba(34,211,238,0.35)]" : ""}`}
                                >

                                    {item.label}

                                </Link>

                                {done && (
                                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                )}

                            </div>

                            {i !== items.length - 1 && (
                                <div className="w-14 h-[2px] bg-slate-700" />
                            )}

                        </div>

                    )

                })}

            </div>

        </div>
    )
}

function SimulatorCard({ n, type, title, desc, link, btn = "open simulator" }) {
    return (
        <Link
            to={link}
            className="group relative rounded-xl border border-slate-800 bg-gradient-to-b from-[#020617] to-[#020617]/60 p-6 transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
        >
            <div className="text-[11px] tracking-[0.25em] text-slate-400 mb-3">
                {n} · {type}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {desc}
            </p>
            <div className="text-cyan-400 text-sm font-medium tracking-wide group-hover:text-emerald-300">
                → {btn}
            </div>
        </Link>
    )
}
function Feature({ title, desc }) {
    return (
        <div className="border border-slate-800 rounded-xl p-6 bg-slate-900/40">
            <p className="text-xs tracking-wider text-cyan-400">
                {title}
            </p>
            <p className="mt-2 text-slate-400">
                {desc}
            </p>
        </div>
    )
}