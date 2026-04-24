import AlgorithmSimulator from "../components/AlgorithmSimulator"
import { fifoSteps } from "../algorithms/fifo"

export default function FIFO() {
    const fifoNotes = [
        {
            label: "Rule",
            text: "Evict the page that was loaded first (oldest).",
            color: "text-cyan-300"
        },
        {
            label: "Data structure",
            text: "Queue (First-In First-Out).",
            color: "text-purple"
        },
        {
            label: "Pros",
            text: "Very simple and low overhead.",
            color: "text-green"
        },
        {
            label: "Cons",
            text: "Ignores usage; suffers Belady’s anomaly.",
            color: "text-red"
        }
    ]

    fifoNotes.trick = {
        title: "Bread Queue",
        description: "First loaf in → first loaf out."
    }
    return (
        <AlgorithmSimulator
            title="FIFO — First In First Out"
            algorithm={fifoSteps}
            notes={fifoNotes}
        />

    )
}