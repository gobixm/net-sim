import { NetworkHistory, NetworkEvent } from './../src/history';
import { expect } from 'chai';

describe('network history', () => {
    it('add events', () => {
        const history = new NetworkHistory();
        const event: NetworkEvent = {
            nodeState: 'state'
        } as NetworkEvent;

        history.add(event);
        history.add(event);

        expect(history.history).deep.equals([event, event]);
    });

    it('clear events', () => {
        const history = new NetworkHistory();
        const event: NetworkEvent = {
            nodeState: 'state'
        } as NetworkEvent;
        history.add(event);
        history.add(event);

        history.clear();

        expect(history.history).deep.equals([]);
    });

    it('retain events', () => {
        const history = new NetworkHistory();
        const event1: NetworkEvent = { nodeState: 'state' } as NetworkEvent;
        const event2: NetworkEvent = { nodeState: 'state' } as NetworkEvent;

        history.add(event1);
        history.add(event2);

        history.retain(1);

        expect(history.history).deep.equals([event2]);
    });

    it('retain on add', () => {
        const history = new NetworkHistory(1);
        const event1: NetworkEvent = { nodeState: 'state' } as NetworkEvent;
        const event2: NetworkEvent = { nodeState: 'state' } as NetworkEvent;

        history.add(event1);
        history.add(event2);

        expect(history.history).deep.equals([event2]);
    });
});