export default function Notes() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="inline-block text-[11px] px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-300 tracking-widest">
                CHEAT SHEET
            </div>
            <h1 className="text-5xl font-semibold mt-4">Notes & memory tricks</h1>
            <p className="text-slate-400 mt-3">
                Everything in one place — the tiny mental hooks that make each algorithm stick.
            </p>
            <div className="grid md:grid-cols-3 gap-5 mt-10">
                <Card title="DEMAND PAGING">
                    • Pages load on first access, not at program start.<br />
                    • Valid bit in page table → if 0, trap to OS.<br />
                    • Effective Access Time = (1-p)*tmem + p*tfault.<br />
                    • Tiny fault rate drastically increases EAT.<br /><br />
                    <span className="text-pink-400">💭 "Lazy loading for your RAM."</span>
                </Card>
                <Card title="FIFO">
                    • Evict oldest loaded → simple queue.<br />
                    • Suffers Belady anomaly.<br />
                    • Low overhead; rarely used alone.<br /><br />
                    <span className="text-pink-400">💡 "Bread queue: first in, first out."</span>
                </Card>
                <Card title="OPTIMAL">
                    • Evict page with farthest future use.<br />
                    • Minimum possible faults.<br />
                    • Used as benchmark only.<br /><br />
                    <span className="text-pink-400">💭 "Fortune teller kicks future-useless page."</span>
                </Card>
                <Card title="LRU">
                    • Evict page with oldest last access.<br />
                    • Near Optimal; no Belady anomaly.<br />
                    • Hardware expensive; approximated.<br /><br />
                    <span className="text-pink-400">💭 "Least Recently Used = Least Likely Useful."</span>
                </Card>
                <Card title="NRU">
                    • R bit on access, M bit on writes.<br />
                    • OS periodically resets bits.<br />
                    • Evict lowest non-empty class (0→1→2→3).<br /><br />
                    <span className="text-pink-400">💭 "Class 0 pages are easiest to remove."</span>
                </Card>
                <Card title="SECOND CHANCE (CLOCK)">
                    • FIFO plus reference bit.<br />
                    • R=1 → give second chance.<br />
                    • R=0 → remove immediately.<br /><br />
                    <span className="text-pink-400">💡 "One warning before eviction."</span>
                </Card>
                <Card title="EQUAL ALLOCATION">
                    • m frames / n processes.<br />
                    • Equal memory per process.<br />
                    • Inefficient for different sizes.<br /><br />
                    <span className="text-pink-400">💭 "Equal pizza slices."</span>
                </Card>
                <Card title="PROPORTIONAL ALLOCATION">
                    • a<sub>i</sub> = (s<sub>i</sub> / Σs) × m<br />
                    &nbsp;&nbsp;&nbsp;↳ a<sub>i</sub> = frames given to process i<br />
                    &nbsp;&nbsp;&nbsp;↳ s<sub>i</sub> = size of process i<br />
                    &nbsp;&nbsp;&nbsp;↳ Σs = total size of all processes<br />
                    &nbsp;&nbsp;&nbsp;↳ m = total available frames<br /><br />
                    • Larger process gets more frames.<br />
                    • Fair workload distribution.<br /><br />
                    <span className="text-pink-400">💡 "Pay-per-kg memory."</span>
                </Card>
                <Card title="PRIORITY ALLOCATION">
                    • a<sub>i</sub> proportional to priority.<br />
                    • High priority gets more memory.<br />
                    • Low priority risk starvation.<br /><br />
                    <span className="text-pink-400">💭 "VIP queue."</span>
                </Card>
            </div>
            <div className="border border-slate-800 rounded-xl p-6 mt-10 bg-slate-900/40">
                <p className="text-[11px] text-slate-400 tracking-widest">
                    QUICK FORMULAS
                </p>
                <div className="grid md:grid-cols-4 gap-4 mt-4 text-sm text-slate-300">
                    <p>Hit rate = hits / references</p>
                    <p>Fault rate p = faults / references</p>
                    <p>EAT = (1-p)*tmem + p*tfault</p>
                    <p>Proportional: a<sub>i</sub> = (s<sub>i</sub>/Σs)*m</p>
                    <p>a<sub>i</sub> ∝ w<sub>i</sub></p>
                    <p>Belady: FIFO may worsen with more frames</p>
                </div>
            </div>
            <div className="mt-16 flex justify-between text-xs text-slate-500">
                <p>/* Virtual Memory Management – interactive */</p>
                <p>hit · fault · current</p>
            </div>
        </div>
    )
}
function Card({ title, children }) {
    return (
        <div className="border border-slate-800 rounded-xl p-5 bg-slate-900/40 backdrop-blur">
            <p className="text-[11px] tracking-widest text-violet-300 mb-3">
                {title}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
                {children}
            </p>
        </div>
    )
}