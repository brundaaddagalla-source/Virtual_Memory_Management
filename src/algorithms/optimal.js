/* ================= COMMON ================= */

function formatFrames(memory, frames) {
    return Array(frames)
        .fill(null)
        .map((_, i) => memory[i] ?? null)
}


/* ================= BASIC OPTIMAL (COMPARE) ================= */

export function optimal(ref, frames) {

    // ✅ SAFETY
    if (!Array.isArray(ref) || ref.length === 0) {
        return { faults: 0, result: [] }
    }

    if (!frames || frames <= 0) {
        return { faults: 0, result: [] }
    }

    let memory = []
    let faults = 0
    let result = []

    for (let i = 0; i < ref.length; i++) {

        let page = ref[i]

        const exists = memory.includes(page)

        if (exists) {

            result.push("H")

        } else {

            faults++
            result.push("F")

            if (memory.length < frames) {

                memory.push(page)

            } else {

                // look ahead without slicing
                let replaceIndex = 0
                let farthest = -1

                for (let j = 0; j < memory.length; j++) {

                    let nextUse = ref.indexOf(memory[j], i + 1)

                    if (nextUse === -1) {
                        replaceIndex = j
                        break
                    }

                    if (nextUse > farthest) {
                        farthest = nextUse
                        replaceIndex = j
                    }
                }

                memory[replaceIndex] = page
            }
        }
    }

    return { faults, result }
}


/* ================= OPTIMAL STEPS (SIMULATOR) ================= */

export function optimalSteps(ref, frames) {

    // ✅ SAFETY
    if (!Array.isArray(ref) || ref.length === 0) {
        return []
    }

    if (!frames || frames <= 0) {
        return []
    }

    let memory = []
    let faults = 0
    let hits = 0
    let history = []

    for (let i = 0; i < ref.length; i++) {

        let page = ref[i]

        let frameIndex = memory.indexOf(page)
        let type = "fault"
        let removedPage = null
        let isInitialFill = false

        /* ================= HIT ================= */

        if (frameIndex !== -1) {

            hits++
            type = "hit"

        }

        /* ================= FAULT ================= */

        else {

            faults++

            if (memory.length < frames) {

                memory.push(page)
                frameIndex = memory.length - 1
                isInitialFill = true

            }

            else {

                let replaceIndex = 0
                let farthest = -1

                for (let j = 0; j < memory.length; j++) {

                    let nextUse = ref.indexOf(memory[j], i + 1)

                    if (nextUse === -1) {
                        replaceIndex = j
                        break
                    }

                    if (nextUse > farthest) {
                        farthest = nextUse
                        replaceIndex = j
                    }
                }

                removedPage = memory[replaceIndex]

                memory[replaceIndex] = page
                frameIndex = replaceIndex
            }
        }

        /* ================= EXPLANATION ================= */

        let explanation

        if (type === "hit") {

            explanation = {
                observation: `Page ${page} already exists in memory`,
                reasoning: "No replacement needed",
                action: frameIndex !== -1
                    ? `Access frame ${frameIndex + 1}`
                    : "Frame not found",
                result: "HIT",
                concept: "Page already in memory",
                conceptId: "rule"
            }

        }

        else if (isInitialFill) {

            explanation = {
                observation: "Empty frame available",
                reasoning: "No page needs to be removed",
                action: `Insert page ${page} into frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "Empty frame used",
                conceptId: "rule"
            }

        }

        else {

            explanation = {
                observation: `Page ${page} not in memory`,
                reasoning: `Optimal replaces page ${removedPage} (used farthest in future)`,
                action: `Replace frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "Optimal replaces the page that will be used last in the future",
                conceptId: "rule"
            }
        }

        /* ================= SAVE STEP ================= */

        history.push({
            frames: formatFrames(memory, frames),
            queue: [...memory],
            events: [{
                type,
                frameIndex,
                page
            }],
            faults,
            hits,
            explanation
        })
    }

    return history
}