/* ================= COMMON ================= */

function formatFrames(memory, frames) {
    return Array(frames)
        .fill(null)
        .map((_, i) => memory[i] ?? null)
}


/* ================= BASIC SECOND CHANCE ================= */

export function secondChance(ref, frames) {

    // ✅ SAFETY
    if (!Array.isArray(ref) || ref.length === 0) {
        return { faults: 0, result: [] }
    }

    if (!frames || frames <= 0) {
        return { faults: 0, result: [] }
    }

    let memory = Array(frames).fill(null)
    let refBits = Array(frames).fill(0)

    let pointer = 0
    let faults = 0
    let result = []

    for (let page of ref) {

        let index = memory.indexOf(page)

        if (index !== -1) {

            result.push("H")
            refBits[index] = 1

        } else {

            faults++
            result.push("F")

            // ✅ USE EMPTY FRAME FIRST
            let emptyIndex = memory.indexOf(null)

            if (emptyIndex !== -1) {

                memory[emptyIndex] = page
                refBits[emptyIndex] = 1

            }

            else {

                while (refBits[pointer] === 1) {

                    refBits[pointer] = 0
                    pointer = (pointer + 1) % frames
                }

                memory[pointer] = page
                refBits[pointer] = 1

                pointer = (pointer + 1) % frames
            }
        }
    }

    return { faults, result }
}


/* ================= SECOND CHANCE STEPS ================= */

export function secondChanceSteps(ref, frames) {

    // ✅ SAFETY
    if (!Array.isArray(ref) || ref.length === 0) {
        return []
    }

    if (!frames || frames <= 0) {
        return []
    }

    let memory = Array(frames).fill(null)
    let refBits = Array(frames).fill(0)

    let pointer = 0
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
            refBits[frameIndex] = 1

        }

        /* ================= FAULT ================= */

        else {

            faults++

            let emptyIndex = memory.indexOf(null)

            if (emptyIndex !== -1) {

                memory[emptyIndex] = page
                frameIndex = emptyIndex
                refBits[emptyIndex] = 1
                isInitialFill = true

            }

            else {

                while (refBits[pointer] === 1) {

                    refBits[pointer] = 0
                    pointer = (pointer + 1) % frames
                }

                removedPage = memory[pointer]

                memory[pointer] = page
                frameIndex = pointer

                refBits[pointer] = 1
                pointer = (pointer + 1) % frames
            }
        }

        /* ================= EXPLANATION ================= */

        let explanation

        if (type === "hit") {

            explanation = {
                observation: `Page ${page} already exists in memory`,
                reasoning: "Reference bit set to 1 (second chance given)",
                action: frameIndex !== -1
                    ? `Access frame ${frameIndex + 1}`
                    : "Frame not found",
                result: "HIT",
                concept: "Second Chance keeps recently used pages by giving them another chance",
                conceptId: "rule"
            }

        }

        else if (isInitialFill) {

            explanation = {
                observation: "Empty frame available",
                reasoning: "No replacement required",
                action: `Insert page ${page} into frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "Empty frame used",
                conceptId: "rule"
            }

        }

        else {

            explanation = {
                observation: `Page ${page} not in memory`,
                reasoning: `Pages with reference bit = 1 are skipped; page ${removedPage} replaced`,
                action: `Replace frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "Clock (Second Chance) skips recently used pages before replacing",
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
            pointer,
            explanation
        })
    }

    return history
}