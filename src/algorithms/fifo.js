function formatFrames(memory, frames) {
    return Array(frames)
        .fill(null)
        .map((_, i) => memory[i] ?? null)
}

/* ================= BASIC FIFO (COMPARE) ================= */

export function fifo(ref, frames) {

    // ✅ SAFETY GUARDS
    if (!Array.isArray(ref) || ref.length === 0) {
        return { faults: 0, result: [] }
    }

    if (!frames || frames <= 0) {
        return { faults: 0, result: [] }
    }

    let memory = []
    let pointer = 0

    let faults = 0
    let result = []

    for (let page of ref) {

        const exists = memory.includes(page)

        if (exists) {

            result.push("H")

        } else {

            faults++
            result.push("F")

            if (memory.length < frames) {

                memory.push(page)

            } else {

                memory[pointer] = page
                pointer = (pointer + 1) % frames
            }
        }
    }

    return { faults, result }
}


/* ================= FIFO STEPS (SIMULATOR) ================= */

export function fifoSteps(ref, frames) {

    // ✅ SAFETY GUARDS
    if (!Array.isArray(ref) || ref.length === 0) {
        return []
    }

    if (!frames || frames <= 0) {
        return []
    }

    let memory = []
    let pointer = 0

    let faults = 0
    let hits = 0

    let history = []

    for (let i = 0; i < ref.length; i++) {

        let page = ref[i]

        let frameIndex = memory.indexOf(page)
        let type = "fault"
        let isInitialFill = false
        let removedPage = null

        /* ================= HIT ================= */

        if (frameIndex !== -1) {

            hits++
            type = "hit"

        }

        /* ================= FAULT ================= */

        else {

            faults++

            /* EMPTY FRAME */

            if (memory.length < frames) {

                memory.push(page)
                frameIndex = memory.length - 1
                isInitialFill = true

            }

            /* REPLACEMENT */

            else {

                removedPage = memory[pointer]

                memory[pointer] = page
                frameIndex = pointer

                pointer = (pointer + 1) % frames
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
                concept: "Page hit — already in memory",
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
                reasoning: `FIFO removes oldest page ${removedPage}`,
                action: `Replace frame ${frameIndex + 1}`,
                result: "FAULT",
                concept: "FIFO uses circular pointer to track oldest page",
                conceptId: "rule"
            }

        }

        /* ================= SAVE STEP ================= */

        history.push({
            frames: formatFrames(memory, frames),   // ✅ consistent
            queue: [...memory],
            events: [
                {
                    type,
                    frameIndex,
                    page
                }
            ],
            faults,
            hits,
            pointer,
            explanation
        })
    }

    return history
}