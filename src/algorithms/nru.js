/* ================= COMMON ================= */

function formatFrames(memory, frames) {
    return Array(frames)
        .fill(null)
        .map((_, i) => memory[i] ?? null)
}


/* ================= BASIC NRU (COMPARE) ================= */

export function nru(ref, frames) {

    // ✅ SAFETY
    if (!Array.isArray(ref) || ref.length === 0) {
        return { faults: 0, result: [] }
    }

    if (!frames || frames <= 0) {
        return { faults: 0, result: [] }
    }

    let memory = []
    let refBits = {}

    let faults = 0
    let result = []

    for (let page of ref) {

        const exists = memory.includes(page)

        if (exists) {

            result.push("H")
            refBits[page] = 1

        } else {

            faults++
            result.push("F")

            if (memory.length < frames) {

                memory.push(page)

            } else {

                let candidate = memory.find(p => refBits[p] === 0)

                if (candidate === undefined) {

                    // reset ONLY pages in memory
                    memory.forEach(p => refBits[p] = 0)
                    candidate = memory[0]
                }

                let index = memory.indexOf(candidate)
                memory[index] = page
            }

            refBits[page] = 1
        }
    }

    return { faults, result }
}


/* ================= NRU STEPS (SIMULATOR) ================= */

export function nruSteps(ref, frames) {

    // ✅ SAFETY
    if (!Array.isArray(ref) || ref.length === 0) {
        return []
    }

    if (!frames || frames <= 0) {
        return []
    }

    let memory = []
    let refBits = {}

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
            refBits[page] = 1

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

                let candidate = memory.find(p => refBits[p] === 0)

                if (candidate === undefined) {

                    // reset ONLY pages in memory
                    memory.forEach(p => refBits[p] = 0)
                    candidate = memory[0]
                }

                removedPage = candidate

                frameIndex = memory.indexOf(candidate)
                memory[frameIndex] = page
            }

            refBits[page] = 1
        }

        /* ================= EXPLANATION ================= */

        let explanation

        if (type === "hit") {

            explanation = {
                observation: `Page ${page} already exists in memory`,
                reasoning: "Reference bit updated to indicate recent use",
                action: frameIndex !== -1
                    ? `Access frame ${frameIndex + 1}`
                    : "Frame not found",
                result: "HIT",
                concept: "NRU tracks recently used pages using reference bits",
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
                reasoning: `NRU selects a page with reference bit = 0 (${removedPage})`,
                action: `Replace frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "NRU prefers removing pages that were not recently used",
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