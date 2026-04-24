export function allocationSteps(processes, totalFrames, method) {

    let history = []
    let allocation = Array(processes.length).fill(0)

    let weights = []

    if (method === "equal") {
        weights = processes.map(() => 1)
    }
    else if (method === "proportional") {
        weights = processes.map(p => p.size)
    }
    else {
        weights = processes.map(p => p.priority)
    }

    const totalWeight = weights.reduce((a, b) => a + b, 0)

    /* ================= CALCULATION TEXT ================= */

    let calculationText = ""

    if (method === "equal") {
        const share = Math.floor(totalFrames / processes.length)
        calculationText = `Each process gets ${totalFrames}/${processes.length} = ${share}`
    }

    if (method === "proportional") {

        calculationText += `Total size = ${totalWeight}\n\n`

        processes.forEach((p, i) => {
            const exact = (p.size / totalWeight) * totalFrames
            const base = Math.floor(exact)

            calculationText += `P${i + 1} = (${p.size}/${totalWeight}) * ${totalFrames} = ${exact.toFixed(2)} → ${base}\n`
        })
    }

    if (method === "priority") {

        calculationText += `Total priority = ${totalWeight}\n\n`

        processes.forEach((p, i) => {
            const exact = (p.priority / totalWeight) * totalFrames
            const base = Math.floor(exact)

            calculationText += `P${i + 1} = (${p.priority}/${totalWeight}) * ${totalFrames} = ${exact.toFixed(2)} → ${base}\n`
        })
    }

    /* ================= DISTRIBUTION ================= */

    let baseAlloc = []
    let fractions = []

    for (let i = 0; i < processes.length; i++) {

        let exact = (weights[i] / totalWeight) * totalFrames

        let base = Math.floor(exact)
        baseAlloc.push(base)

        fractions.push({
            index: i,
            frac: exact - base
        })
    }

    let used = baseAlloc.reduce((a, b) => a + b, 0)
    let remaining = totalFrames - used

    fractions.sort((a, b) => b.frac - a.frac)

    for (let i = 0; i < remaining; i++) {
        baseAlloc[fractions[i].index]++
    }

    /* ================= STEP BUILD ================= */

    for (let i = 0; i < processes.length; i++) {

        for (let j = 0; j < baseAlloc[i]; j++) {

            allocation[i]++

            history.push({

                allocation: [...allocation],
                active: i,

                explanation: {
                    observation: `Allocating frame ${history.length + 1}`,

                    reasoning:
                        history.length === 0
                            ? calculationText
                            : method === "equal"
                                ? "Equal distribution continues."
                                : method === "proportional"
                                    ? "Frames assigned based on size ratio."
                                    : "Frames assigned based on priority.",

                    action: `Frame ${history.length + 1} → Process ${i + 1}`,

                    result: `Process ${i + 1} now has ${allocation[i]} frames`
                }
            })
        }
    }

    return history
}