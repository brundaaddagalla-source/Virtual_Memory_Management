function formatFrames(memory, frames) {

    return Array(frames)
        .fill(null)
        .map((_, i) => memory[i] ?? null)

}

export function lru(ref, frames) {

    let memory = []
    let faults = 0
    let result = []

    for (let page of ref) {

        if (memory.includes(page)) {

            result.push("H")

            memory = memory.filter(p => p !== page)
            memory.push(page)

        } else {

            faults++
            result.push("F")

            if (memory.length < frames) {

                memory.push(page)

            } else {

                memory.shift()
                memory.push(page)

            }

        }

    }

    return { faults, result }

}

export function lruSteps(ref, frames) {

    let memory = []
    let lastUsed = {}

    let faults = 0
    let hits = 0

    let history = []

    for (let i = 0; i < ref.length; i++) {

        let page = ref[i]
        let frameIndex = memory.indexOf(page)

        let type = "fault"
        let removedPage = null

        if (frameIndex !== -1) {

            hits++
            type = "hit"

        } else {

            faults++

            if (memory.length < frames) {

                memory.push(page)
                frameIndex = memory.length - 1

            } else {

                let lruPage = memory.reduce((a, b) =>
                    lastUsed[a] < lastUsed[b] ? a : b
                )

                removedPage = lruPage

                frameIndex = memory.indexOf(lruPage)
                memory[frameIndex] = page
            }
        }

        lastUsed[page] = i

        let explanation = type === "hit"
            ? {
                observation: `Page ${page} already exists`,
                reasoning: "Recently used page remains in memory",
                action: `Access frame ${frameIndex + 1}`,
                result: "HIT",
                concept: "Recently used pages are kept",
                conceptId: "rule"
            }
            : {
                observation: `Page ${page} not found`,
                reasoning: removedPage
                    ? `LRU removes least recently used page ${removedPage}`
                    : "Empty frame used",
                action: `Load into frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "Least recently used page is replaced",
                conceptId: "rule"
            }

        history.push({
            frames: formatFrames(memory, frames),
            queue: [...memory],
            events: [{ type, frameIndex, page }],
            faults,
            hits,
            explanation
        })
    }

    return history
}