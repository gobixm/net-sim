import { expect } from 'chai';
import { deepClone } from './../src/utils';

describe('utils', () => {
    it('deepClone clone complex object', () => {
        const source = {
            foo: 'bar',
            map: new Map<string, unknown>([['foo', 'bar'], ['baz', { baz: 'baz' }]]),
            set: new Set<unknown>(['foo', { bar: 'baz' }]),
            date: new Date(),
            regexp: /\w+/
        };

        const clone = deepClone(source);

        expect(clone).deep.equals(source);
    });
});