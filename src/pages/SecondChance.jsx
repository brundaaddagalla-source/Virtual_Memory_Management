import AlgorithmSimulator from "../components/AlgorithmSimulator"
import { secondChanceSteps } from "../algorithms/secondChance"

export default function SecondChance() {
    const scNotes = [
        {
            label: "Rule",
            text: "Pages get a second chance using a reference bit before replacement.",
            color: "text-cyan-300"
        },
        {
            label: "Mechanism",
            text: "If reference bit = 1 → reset it and skip; if 0 → replace.",
            color: "text-purple"
        },
        {
            label: "Pros",
            text: "Better than FIFO; avoids unnecessary replacements.",
            color: "text-green"
        },
        {
            label: "Cons",
            text: "Extra overhead for tracking reference bits.",
            color: "text-red"
        }
    ]

    scNotes.trick = {
        title: "Clock Rotation",
        description: "Like a clock hand — it keeps moving until it finds a page with bit 0."
    }

    return (
        <AlgorithmSimulator
            title="Second Chance — Clock Algorithm"
            algorithm={secondChanceSteps}
            notes={scNotes}
        />

    )

}