import { NavLink } from "react-router-dom"

export default function Navbar() {

  const navClass = ({ isActive }) =>
  `btn text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1 
  border border-white/10 transition-all duration-200
  hover:text-white hover:border-cyan-400/40 
  hover:shadow-[0_0_14px_rgba(34,211,238,0.25)]
  ${isActive
    ? "text-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.45)]"
    : "text-slate-300"
  }`

  return (

    <div className="sticky top-0 z-50 
      bg-[#020617]/80 backdrop-blur-md 
      border-b border-cyan-400/10
      shadow-[0_2px_20px_rgba(34,211,238,0.08)]">

      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">

        <div className="text-cyan-400 font-semibold tracking-wide">
          memoryvisualizer
        </div>

        <div className="flex gap-2 overflow-x-auto whitespace-nowrap sm:overflow-visible sm:flex-wrap scrollbar-hide">

          <NavLink to="/" className={(props) => `${navClass(props)} shrink-0`}>Home</NavLink>

          <NavLink to="/demand-paging" className={(props) => `${navClass(props)} shrink-0`}>
            Demand Paging
          </NavLink>

          <NavLink to="/fifo" className={(props) => `${navClass(props)} shrink-0`}>
            FIFO
          </NavLink>

          <NavLink to="/optimal" className={(props) => `${navClass(props)} shrink-0`}>
            Optimal
          </NavLink>

          <NavLink to="/lru" className={(props) => `${navClass(props)} shrink-0`}>
            LRU
          </NavLink>

          <NavLink to="/nru" className={(props) => `${navClass(props)} shrink-0`}>
            NRU
          </NavLink>

          <NavLink to="/second-chance" className={(props) => `${navClass(props)} shrink-0`}>
            Second Chance
          </NavLink>

          <NavLink to="/allocation" className={(props) => `${navClass(props)} shrink-0`}>
            Allocation
          </NavLink>

          <NavLink to="/compare" className={(props) => `${navClass(props)} shrink-0`}>
            Compare
          </NavLink>

          <NavLink to="/notes" className={(props) => `${navClass(props)} shrink-0`}>
            Notes
          </NavLink>

        </div>

      </div>

    </div>

  )
}