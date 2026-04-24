import AlgorithmSimulator from "../components/AlgorithmSimulator"
import { optimalSteps } from "../algorithms/optimal"

export default function Optimal() {
    const optimalNotes = [
        {
            label: "Rule",
            text: "Replace the page that will not be used for the longest time in the future.",
            color: "text-cyan-300"
        },
        {
            label: "Idea",
            text: "Uses future knowledge to minimize page faults.",
            color: "text-purple"
        },
        {
            label: "Pros",
            text: "Gives the minimum possible page faults (best performance).",
            color: "text-green"
        },
        {
            label: "Cons",
            text: "Not practical — future references are unknown in real systems.",
            color: "text-red"
        }
    ]

    optimalNotes.trick = {
        title: "Future Vision",
        description: "Remove the page you won’t need for the longest time."
    }

    return (
        <AlgorithmSimulator
            title="Optimal — Belady's Algorithm"
            algorithm={optimalSteps}
            notes={optimalNotes}
        />
    )

}