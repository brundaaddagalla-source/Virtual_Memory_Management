# Virtual Memory Management Visualizer

An interactive simulator to understand and compare page replacement algorithms with step-by-step visualization and predictive learning.

## Features

- Step-by-step simulation of page replacement algorithms
- Supports FIFO, LRU, Optimal, NRU, and Second Chance
- Interactive "predict next step" system for active learning
- Real-time metrics: hits, faults, hit rate
- Comparative analysis across algorithms
- Frame allocation strategies visualization
- Smart insights on locality and reuse patterns

## What Makes This Unique

- Goes beyond static visualization — includes prediction-based learning
- Highlights internal decision-making (why a page was replaced)
- Provides pattern insights like locality and reuse distance
- Designed for deep conceptual understanding, not just output generation

## Tech Stack

- React (Vite)
- Tailwind CSS
- JavaScript (ES6)

## Run Locally

git clone https://github.com/your-repo
cd Virtual_Memory_Management
npm install
npm run dev

## Algorithms Implemented

- FIFO (First-In First-Out)
- LRU (Least Recently Used)
- Optimal (Belady’s Algorithm)
- NRU (Not Recently Used)
- Second Chance (Clock Algorithm)

## Future Improvements

- Add LFU algorithm
- Visual graph comparisons
- Performance benchmarking with large inputs
