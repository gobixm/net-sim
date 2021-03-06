import { Point } from './primitives';

function equalDoubles(n1: number, n2: number, precision: number): boolean {
    return Math.abs(n1 - n2) <= precision;
}

function compareDoubles(n1: number, n2: number, precision = 0.001): number {
    if (equalDoubles(n1, n2, precision)) {
        return 0;
    }

    return n1 - n2;
}

function lineCircleIntersection(
    circle: Point, r: number,
    from: Point,
    to: Point): Point[] {
    const q = circle.x * circle.x + circle.y * circle.y - r * r;
    const k = -2.0 * circle.x;
    const l = -2.0 * circle.y;

    const z = from.x * to.y - to.x * from.y;
    const p = from.y - to.y;
    let s = from.x - to.x;

    if (equalDoubles(s, 0.0, 0.001)) {
        s = 0.001;
    }

    // voodoo magic
    const A = s * s + p * p;
    const B = s * s * k + 2.0 * z * p + s * l * p;
    const C = q * s * s + z * z + s * l * z;

    const D = B * B - 4.0 * A * C;


    if (D < 0.0) {
        return [];
    }
    else if (D < 0.001) {
        const xa = -B / (2.0 * A);
        const ya = (p * xa + z) / s;
        return [{ x: xa, y: ya }];
    }
    else {
        const xa = (-B + Math.sqrt(D)) / (2.0 * A);
        const ya = (p * xa + z) / s;

        const xb = (-B - Math.sqrt(D)) / (2.0 * A);
        const yb = (p * xb + z) / s;
        return [{ x: xa, y: ya }, { x: xb, y: yb }];
    }
}

export function segmentCircleIntersection(
    circle: Point,
    r: number,
    from: Point,
    to: Point): Point | undefined {
    if (compareDoubles(from.x, to.x) === 0 && compareDoubles(from.y, to.y) === 0) {
        return undefined;
    }

    const d1 = Math.hypot(from.x - circle.x, from.y - circle.y);
    const d2 = Math.hypot(to.x - circle.x, to.y - circle.y);
    if (d1 > r && d2 > r) {
        return undefined;
    }
    if (d1 < r && d2 < r) {
        return undefined;
    }

    const points = lineCircleIntersection(circle, r, from, to);
    if (points.length < 1) {
        return undefined;
    }

    const xmin = Math.min(from.x, to.x);
    const xmax = Math.max(from.x, to.x);
    const ymin = Math.min(from.y, to.y);
    const ymax = Math.max(from.y, to.y);

    if (compareDoubles(points[0].x, xmin) >= 0 && compareDoubles(points[0].x, xmax) <= 0 && compareDoubles(points[0].y, ymin) >= 0 && compareDoubles(points[0].y, ymax) <= 0) {
        return points[0];
    }

    if (compareDoubles(points[1].x, xmin) >= 0 && compareDoubles(points[1].x, xmax) <= 0 && compareDoubles(points[1].y, ymin) >= 0 && compareDoubles(points[1].y, ymax) <= 0) {
        return points[1];
    }

    return undefined;
}