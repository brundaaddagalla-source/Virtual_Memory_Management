/** @type {import('tailwindcss').Config} */
export default {
 content:[
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
 ],

 theme:{
  extend:{

   colors:{
    bg:"#020617",
    card:"#020617",
    border:"#1e293b",
    accent:"#22d3ee",
    accentSoft:"#67e8f9",
    purple:"#a78bfa",
    green:"#4ade80",
    red:"#fb7185",
    yellow:"#fbbf24"
   },

   fontFamily:{
    sans:["Inter","system-ui","sans-serif"],
    heading:["Space Grotesk","Inter","sans-serif"],
    mono:["JetBrains Mono","monospace"]
   }

  }
 },

 plugins:[]
}