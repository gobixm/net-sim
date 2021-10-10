import { PacketView, PacketViewOptions } from './../src/views/packet-view';
import { NodeView, NodeViewOptions } from './../src/views/node-view';
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
        sinon.stub(sender, 'options').value(<NodeViewOptions>{ radius: 10 });
        const receiver = sinon.createStubInstance(NodeView);
        sinon.stub(receiver, 'origin').value(toPoint);
        sinon.stub(receiver, 'options').value(<NodeViewOptions>{ radius: 10 });
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

        packetView.update(timeBase + latency * 3 / 4);

        expect(packetView.origin.x).greaterThan(45).lessThan(46);
        expect(packetView.origin.y).greaterThan(22).lessThan(23);
    });

    it('updateOrigin zero remaining progress', () => {
        const timeBase: Time = 1000;
        const latency: Time = 1000;
        const fromPoint: Point = { x: 0, y: 0 };
        const toPoint: Point = { x: 100, y: 0 };
        const sender = sinon.createStubInstance(NodeView);
        sinon.stub(sender, 'origin').value(fromPoint);
        sinon.stub(sender, 'options').value(<NodeViewOptions>{ radius: 10 });
        const receiver = sinon.createStubInstance(NodeView);
        sinon.stub(receiver, 'origin').value(toPoint);
        sinon.stub(receiver, 'options').value(<NodeViewOptions>{ radius: 10 });
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

        packetView.update(timeBase + latency);

        expect(packetView.origin).deep.equals(<Point>{ x: 90, y: 0 });
    });

    it('props returned', () => {
        const sender = sinon.createStubInstance(NodeView);
        sinon.stub(sender, 'origin').value({ x: 0, y: 0 });
        sinon.stub(sender, 'options').value(<NodeViewOptions>{ radius: 10 });
        const receiver = sinon.createStubInstance(NodeView);
        sinon.stub(receiver, 'origin').value({ x: 100, y: 100 });
        sinon.stub(receiver, 'options').value(<NodeViewOptions>{ radius: 10 });

        const timeBase: Time = 1000;
        const latency: Time = 1000;
        const packet = {
            body: 'body',
            type: 'type',
            metadata: {
                latency: latency,
                sentAt: timeBase,
                id: 1
            }
        };
        const options: PacketViewOptions = {
            color: '#fff',
            radius: 42,
            showStateOnCreate: false
        };
        const packetView = new PacketView(
            packet as unknown as Packet<string>,
            sender as unknown as NodeView,
            receiver as unknown as NodeView,
            options
        );

        expect(packetView.from.x).closeTo(7.07, 0.1);
        expect(packetView.from.y).closeTo(7.07, 0.1);
        expect(packetView.to.x).closeTo(92.92, 0.1);
        expect(packetView.to.y).closeTo(92.92, 0.1);
        expect(packetView.body).equals(packet.body);
        expect(packetView.metadata).deep.equals(packet.metadata);
        expect(packetView.options).deep.equals(options);
        expect(packetView.type).equals(packet.type);


    });
});