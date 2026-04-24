import ReactFlow, { Background, Controls } from "reactflow"
import "reactflow/dist/style.css"
import dagre from "dagre"

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodesData = [
    { id: "vm", label: "Virtual Memory", rank: 0 },

    { id: "dp", label: "Demand Paging", rank: 1 },

    { id: "pr", label: "Page Replacement", rank: 2 },
    { id: "fa", label: "Frame Allocation", rank: 2 },

    { id: "fifo", label: "FIFO", rank: 3 },
    { id: "lru", label: "LRU", rank: 3 },
    { id: "optimal", label: "Optimal", rank: 3 },
    { id: "nru", label: "NRU", rank: 3 },
    { id: "sc", label: "Second Chance", rank: 3 },

    { id: "equal", label: "Equal", rank: 3 },
    { id: "priority", label: "Priority", rank: 3 },
    { id: "prop", label: "Proportional", rank: 3 }
]

const edgesData = [
    ["vm", "dp"],
    ["dp", "pr"],
    ["dp", "fa"],
    ["pr", "fifo"],
    ["pr", "lru"],
    ["pr", "optimal"],
    ["pr", "nru"],
    ["pr", "sc"],
    ["fa", "equal"],
    ["fa", "priority"],
    ["fa", "prop"]
]

const layout = (nodes, edges) => {

    dagreGraph.setGraph({
        rankdir: "LR",
        align: "UL",
        nodesep: 35,
        ranksep: 110,
        marginx: 20,
        marginy: 20
    })

    nodes.forEach(n => {
        dagreGraph.setNode(n.id, {
            width: 100,
            height: 100,
            rank: n.rank
        })
    })

    edges.forEach(e => dagreGraph.setEdge(e.source, e.target))

    dagre.layout(dagreGraph)

    return nodes.map(n => {
        const p = dagreGraph.node(n.id)

        return {
            ...n,
            position: {
                x: p.x - 50,
                y: p.y - 50
            }
        }
    })
}

export default function HomeGraph() {

    const nodes = layout(
        nodesData.map(n => ({
            id: n.id,
            data: { label: n.label },
            position: { x: 0, y: 0 },
            style: {
                background: "#020617",
                color: "white",
                borderRadius: "999px",
                border: "1px solid #6366f1",
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12
            }
        })),
        edgesData.map(e => ({
            id: e.join("-"),
            source: e[0],
            target: e[1]
        }))
    )

    const edges = edgesData.map(e => ({
        id: e.join("-"),
        source: e[0],
        target: e[1],
        animated: true,
        style: { stroke: "#64748b" }
    }))

    return (
        <div className="h-[420px] border border-slate-800 rounded-xl overflow-hidden">

            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                proOptions={{ hideAttribution: true }}
            >

                <Background color="#0ea5e9" gap={40} size={1} />

                <Controls />

            </ReactFlow>

        </div>
    )
}