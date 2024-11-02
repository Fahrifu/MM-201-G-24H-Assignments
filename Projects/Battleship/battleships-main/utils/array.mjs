export function create2DArrayWithFill(dim, fillValue = null) {
    return Array.from({ length: dim }, () => Array(dim).fill(fillValue));
}