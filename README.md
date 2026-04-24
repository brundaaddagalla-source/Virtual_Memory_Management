# Virtual Memory Management Visualizer

An interactive system to simulate and analyze page replacement algorithms with step-by-step execution, predictive learning, and real-time performance insights.

## Features

- Step-by-step simulation with visual memory state transitions
- Predict-the-next-step system for active learning
- Real-time metrics: page faults, hits, hit rate
- Comparative analysis across algorithms
- Frame allocation strategies visualization
- Smart insights on locality and reuse patterns
- Supports FIFO, LRU, Optimal, NRU, and Second Chance

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

- git clone https://github.com/brundaaddagalla-source/Virtual_Memory_Management.git
- cd Virtual_Memory_Management
- npm install
- npm run dev

## Live Demo

- https://virtual-memory-management.vercel.app/

## Algorithms Implemented

- FIFO (First-In First-Out)
- LRU (Least Recently Used)
- Optimal (Belady’s Algorithm)
- NRU (Not Recently Used)
- Second Chance (Clock Algorithm)

## Future Improvements

- Add LFU and Working Set algorithms
- Introduce performance benchmarking on large datasets
- Export simulation results for analysis
- Add timeline-based visualization
