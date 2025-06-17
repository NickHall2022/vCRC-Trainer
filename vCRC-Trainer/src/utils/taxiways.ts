
type Coordinate = {
    x: number;
    y: number;
    id?: string;
}

export type Node = Coordinate & { edges: Node[] }

const A = [
    {x: 14, y: 34.5},
    {x: 27, y: 39.5},
    {x: 40, y: 44},
    {x: 45, y: 46},
    {x: 50, y: 47.75},
    {x: 55, y: 49.5},
    {x: 60, y: 51.5},
    {x: 64, y: 53.25, id: "AC"},
    {x: 71, y: 55.25},
    {x: 73, y: 55, id: "A36"},
    {x: 75, y: 54.5},
    {x: 84, y: 58, id: "END"},
];

const C = [
    {x: 66.5, y: 20},
    {x: 66.4, y: 25},
    {x: 66, y: 30},
    {x: 65.6, y: 35},
    {x: 65.2, y: 41.5, id: "CG"},
    {x: 64.5, y: 48, id: "aboveAC"}
]

function joinTaxiway(taxiway: Coordinate[]): Node[] {
    const joinedTaxiway: Node[] = taxiway.map(coord => { return {...coord, edges: []}});
    for(let i = 0; i < joinedTaxiway.length; i++){
        if(i < joinedTaxiway.length - 1){
            joinedTaxiway[i].edges.push(joinedTaxiway[i + 1])
        }
    }
    return joinedTaxiway;
}

function joinByIds(graph: Node[], firstId: string, secondId: string){
    const firstNode = graph.find(node => node.id === firstId) as Node;
    const secondNode = graph.find(node => node.id === secondId) as Node;
    firstNode.edges.push(secondNode);
    secondNode.edges.push(firstNode);
    return graph;
}

export const taxiways: Node[] = (() => {
    const graph: Node[] = joinByIds(joinTaxiway(A).concat(joinTaxiway(C)), "AC", "aboveAC");
    return graph;
})();

export function distance(x1: number, y1: number, x2: number, y2: number){
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}
