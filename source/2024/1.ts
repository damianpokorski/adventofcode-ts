import { register } from "../registry"
import "../utils"

register(2024, 1, async (part, input) => {
    const parsed = input
        .map(line => line.split("   ")) as [string, string][];

    const left = parsed.map(input => input[0]);
    const right = parsed.map(input => input[1]);

    if(part == 1) {
        const zipped = [...left].sort().zip([...right].sort());
    
        const distance = zipped
            .map(([a,b]) => Math.abs(parseInt(a)-parseInt(b)));
    
        return distance.reduce((a,b) => a+b,0).toString();
    }

    return left
        .map(a => parseInt(a)* right.filter(b => a == b).length)
        .reduce((a,b) => a+b, 0)
        .toString();
})