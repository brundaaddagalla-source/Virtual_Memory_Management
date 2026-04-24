export function parseRef(input) {

    if (!input || !input.trim()) {
        return { error: "Enter reference string" }
    }

    const tokens = input.split(",").map(t => t.trim())

    // ❌ empty values like 1,,2
    if (tokens.some(t => t === "")) {
        return { error: "Empty values are not allowed (e.g. 1,,2)" }
    }

    const ref = tokens.map(Number)

    // ❌ non-numbers
    if (ref.some(Number.isNaN)) {
        return { error: "Only numbers are allowed" }
    }

    // ❌ decimals
    if (ref.some(n => !Number.isInteger(n))) {
        return { error: "Only integers are allowed" }
    }

    // ❌ too long (performance protection)
    if (ref.length > 200) {
        return { error: "Reference string too long (max 200)" }
    }

    return { ref }
}


export function parseFrames(frames) {

    const n = Number(frames)

    if (!frames || !Number.isInteger(n) || n <= 0) {
        return { error: "Frames must be a positive integer" }
    }

    if (n > 50) {
        return { error: "Too many frames (max 50)" }
    }

    return { frameCount: n }
}