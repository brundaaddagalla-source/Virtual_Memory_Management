import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import ErrorBoundary from "./components/ErrorBoundary"
import Home from "./pages/Home"
import DemandPaging from "./pages/DemandPaging"
import Compare from "./pages/Compare"
import Notes from "./pages/Notes"
import Allocation from "./pages/Allocation"
import FIFO from "./pages/FIFO"
import LRU from "./pages/LRU"
import Optimal from "./pages/Optimal"
import NRU from "./pages/NRU"
import SecondChance from "./pages/SecondChance"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020617] text-white">

        {/* background grid */}
        <div
          className="fixed inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#38bdf8 1px,transparent 1px),linear-gradient(90deg,#38bdf8 1px,transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">

          <Navbar />

          {/* GLOBAL PAGE WRAPPER */}
          <main className="flex-1 w-full px-6 xl:px-6 py-6">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/fifo" element={<FIFO />} />
                <Route path="/lru" element={<LRU />} />
                <Route path="/optimal" element={<Optimal />} />
                <Route path="/nru" element={<NRU />} />
                <Route path="/second-chance" element={<SecondChance />} />
                <Route path="/demand-paging" element={<DemandPaging />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/allocation" element={<Allocation />} />
              </Routes>
            </ErrorBoundary>
          </main>

        </div>
      </div>
    </BrowserRouter>
  )
}