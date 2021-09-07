import { PacketView } from './../src/views/packet-view';
import { NodeView } from './../src/views/node-view';
import { Packet, Time } from '@gobixm/sim';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Point } from '../src/common/primitives';

describe('packet view', () => {
    it('updateOrigin calculates origin based on time', () => {
        const timeBase: Time = 1000;
        const latency: Time = 1000;
        const fromPoint: Point = { x: -100, y: -50 };
        const toPoint: Point = { x: 100, y: 50 };
        const sender = sinon.createStubInstance(NodeView);
        sinon.stub(sender, 'origin').value(fromPoint);
        const receiver = sinon.createStubInstance(NodeView);
        sinon.stub(receiver, 'origin').value(toPoint);
        const packet = {
            metadata: {
                latency: latency,
                sentAt: timeBase
            }
        } as Packet<unknown>;

        const packetView = new PacketView(
            packet,
            sender as unknown as NodeView,
            receiver as unknown as NodeView,
        );

        packetView.updateOrigin(timeBase + latency * 3 / 4);

        expect(packetView.origin).deep.equals(<Point>{ x: 50, y: 25 });
    });
});