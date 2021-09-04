import { expect } from 'chai';
import { Time } from '../src/time';
import { TickCallback, Timeline } from '../src/timeline';

describe('timeline', () => {
    it('tick increases timeline', () => {
        const timeline = new Timeline();

        timeline.tick(10);

        const currentTime = timeline.time;
        expect(currentTime).equal(10);
    });

    it('subscribeTick callback called', () => {
        const timeline = new Timeline();
        const duration: Time = 10;
        let elapsed = 0;
        const callback: TickCallback = (d: Time) => { elapsed = d; };

        timeline.subscribeTick(callback);
        timeline.tick(duration);

        expect(elapsed).equal(duration);
    });

    it('unsubscribe callback not called', () => {
        const timeline = new Timeline();
        const duration: Time = 10;
        let elapsed = 0;
        const callback: TickCallback = (d: Time) => { elapsed = d; };
        const dispose = timeline.subscribeTick(callback);

        dispose();
        timeline.tick(duration);

        expect(elapsed).equal(0);
    });
});