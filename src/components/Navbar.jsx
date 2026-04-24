import { NavLink } from "react-router-dom"

export default function Navbar() {

  const navClass = ({ isActive }) =>
    `btn text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1 ${
  isActive ? "text-white border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]" : ""
}`

  return (

    <div className="sticky top-0 z-50 backdrop-blur border-b border-slate-800">

      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">

        <div className="text-cyan-400 font-semibold tracking-wide">
          memoryvisualizer
        </div>

        <div className="flex gap-2 flex-wrap">

          <NavLink to="/" className={navClass}>Home</NavLink>

          <NavLink to="/demand-paging" className={navClass}>
            Demand Paging
          </NavLink>

          <NavLink to="/fifo" className={navClass}>
            FIFO
          </NavLink>

          <NavLink to="/optimal" className={navClass}>
            Optimal
          </NavLink>

          <NavLink to="/lru" className={navClass}>
            LRU
          </NavLink>

          <NavLink to="/nru" className={navClass}>
            NRU
          </NavLink>

          <NavLink to="/second-chance" className={navClass}>
            Second Chance
          </NavLink>

          <NavLink to="/allocation" className={navClass}>
            Allocation
          </NavLink>

          <NavLink to="/compare" className={navClass}>
            Compare
          </NavLink>

          <NavLink to="/notes" className={navClass}>
            Notes
          </NavLink>

        </div>

      </div>

    </div>

  )
}