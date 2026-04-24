export function runAlgorithms(ref, frameCount, algos) {

  const results = algos.map(algo => {
    const output = algo.fn(ref, frameCount)

    return {
      name: algo.name,
      faults: output.faults,
      result: output.result,
      rate: ((output.faults / output.result.length) * 100).toFixed(1)
    }
  })

  return results
}