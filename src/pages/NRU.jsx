import AlgorithmSimulator from "../components/AlgorithmSimulator"
import { nruSteps } from "../algorithms/nru"

export default function NRU() {
    const nruNotes = [
        {
            label: "Rule",
            text: "Replace a page based on reference bit (0 = not recently used).",
            color: "text-cyan-300"
        },
        {
            label: "Classification",
            text: "Pages are grouped based on reference bits into priority classes.",
            color: "text-purple"
        },
        {
            label: "Pros",
            text: "Simple approximation of LRU.",
            color: "text-green"
        },
        {
            label: "Cons",
            text: "Not always accurate — depends on periodic bit resets.",
            color: "text-red"
        }
    ]

    nruNotes.trick = {
        title: "Lazy Page",
        description: "Pages not used recently (bit = 0) are removed first."
    }
    return (

        <AlgorithmSimulator
            title="NRU — Not Recently Used"
            algorithm={nruSteps}
            notes={nruNotes}
        />

    )

}