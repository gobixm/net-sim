import { Point } from './../src/common/primitives';
import { expect } from 'chai';
import { segmentCircleIntersection } from '../src/common/math-utils';

describe('network view', () => {
    it('no intersection outside', () => {
        const origin: Point = {
            x: 0,
            y: 0
        };
        const radius = 100;

        const from: Point = {
            x: 101,
            y: 0
        };

        const to: Point = {
            x: 200,
            y: 0
        };

        const intersection = segmentCircleIntersection(origin, radius, from, to);

        expect(intersection).undefined;
    });

    it('no intersection inside', () => {
        const origin: Point = {
            x: 0,
            y: 0
        };
        const radius = 100;

        const from: Point = {
            x: 1,
            y: 0
        };

        const to: Point = {
            x: 99,
            y: 0
        };

        const intersection = segmentCircleIntersection(origin, radius, from, to);

        expect(intersection).undefined;
    });

    it('zero length section', () => {
        const origin: Point = {
            x: 0,
            y: 0
        };
        const radius = 100;

        const from: Point = {
            x: 100,
            y: 0
        };

        const to: Point = {
            x: 100,
            y: 0
        };

        const intersection = segmentCircleIntersection(origin, radius, from, to);

        expect(intersection).undefined;
    });

    it('zero x length section', () => {
        const origin: Point = {
            x: 0,
            y: 0
        };
        const radius = 100;

        const from: Point = {
            x: 0,
            y: 0
        };

        const to: Point = {
            x: 0,
            y: 100
        };

        const intersection = segmentCircleIntersection(origin, radius, from, to);

        expect(intersection).not.undefined;
        expect(intersection?.x).closeTo(0, 0.001);
        expect(intersection?.y).closeTo(100, 0.001);
    });

    it('single point intersection', () => {
        const origin: Point = {
            x: 0,
            y: 0
        };
        const radius = 100;

        const from: Point = {
            x: 0,
            y: 0
        };

        const to: Point = {
            x: 100,
            y: 100
        };

        const intersection = segmentCircleIntersection(origin, radius, from, to);

        expect(intersection).not.undefined;
        expect(intersection?.x).closeTo(70.7106, 0.001);
        expect(intersection?.y).closeTo(70.7106, 0.001);
    });
});