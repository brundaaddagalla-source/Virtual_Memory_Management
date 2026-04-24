import AlgorithmSimulator from "../components/AlgorithmSimulator"
import { lruSteps } from "../algorithms/lru"

export default function LRU() {
    const lruNotes = [
        {
            label: "Rule",
            text: "Replace the least recently used page.",
            color: "text-cyan-300"
        },
        {
            label: "Idea",
            text: "Recently used pages are likely to be used again.",
            color: "text-purple"
        },
        {
            label: "Pros",
            text: "Better than FIFO in most cases.",
            color: "text-green"
        },
        {
            label: "Cons",
            text: "Needs tracking of usage history.",
            color: "text-red"
        }
    ]

    lruNotes.trick = {
        title: "Forgetful Brain",
        description: "You forget what you haven't used recently."
    }

    return (
        <AlgorithmSimulator
            title="LRU — Least Recently Used"
            algorithm={lruSteps}
            notes={lruNotes}
        />
    )

}