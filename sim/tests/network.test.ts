import { NetworkEvent } from './../src/history';
import { Timeline } from './../src/timeline';
import { Network, NetworkNodeCallback, NetworkPacketCallback } from './../src/network';
import { Node } from './../src/node';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NetworkHistory } from '../src/history';

describe('network', () => {
    it('start subscribes to timeline', () => {
        const timeline = sinon.createStubInstance(Timeline);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);

        network.start();

        expect(timeline.subscribeTick.called).true;
    });

    it('stop unsubscribes from timeline', () => {
        const timeline = sinon.createStubInstance(Timeline);
        const dispose = sinon.fake(() => {
            // stub
        });
        timeline.subscribeTick.returns(dispose);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();

        network.stop();

        expect(dispose.calledOnce).true;
    });

    it('start twice - single subscribe to timeline', () => {
        const timeline = sinon.createStubInstance(Timeline);
        timeline.subscribeTick.returns(() => {
            //do nothing
        });
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);

        network.start();
        network.start();

        expect(timeline.subscribeTick.calledOnce).true;
    });

    it('stop without start not unsubscribes', () => {
        const timeline = sinon.createStubInstance(Timeline);
        const dispose = sinon.fake(() => {
            // stub
        });
        timeline.subscribeTick.returns(dispose);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);

        network.stop();
        network.stop();

        expect(dispose.notCalled).true;
    });

    it('sendPacket packet created', () => {
        const timeline = new Timeline();
        const sender = sinon.createStubInstance(Node);
        const receiver = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        network.registerNode(sender);
        timeline.tick(111);

        const packet = network.sendPacket<string>('msg', 'body', sender as unknown as Node<string>, receiver as unknown as Node<string>);
        timeline.tick(100);
        const otherPacket = network.sendPacket<string>('msg', 'body', sender as unknown as Node<string>, receiver as unknown as Node<string>);

        expect(packet.type).equals('msg');
        expect(packet.body).equals('body');
        expect(packet.metadata.id).equals(0);
        expect(packet.metadata.sender).equals(sender);
        expect(packet.metadata.receiver).equals(receiver);
        expect(packet.metadata.sentAt).equals(111);

        expect(otherPacket.metadata.id).equals(1);
        expect(otherPacket.metadata.sentAt).equals(211);
    });

    it('sendPacket registered node, packet processed', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        network.registerNode(node);

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency);

        expect(node.processPacket.calledOnceWith(packet)).true;
    });

    it('sendPacket no registered node, packet skipped', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency);

        expect(node.processPacket.notCalled).true;
    });

    it('sendPacket too early, packet skipped', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        network.registerNode(node);

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency - 1);

        expect(node.processPacket.notCalled).true;
    });

    it('sendPacket multiple packets processed', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        network.registerNode(node);

        const packet1 = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet1.metadata.latency);
        const packet2 = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet2.metadata.latency);

        expect(node.processPacket.getCall(0).calledWith(packet1)).true;
        expect(node.processPacket.getCall(1).calledWith(packet2)).true;
    });

    it('unregisterNode packet lost', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        sinon.replaceGetter(node, 'id', () => 'the id');

        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        network.registerNode(node);
        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);

        network.unregisterNode(node.id);
        timeline.tick(packet.metadata.latency);

        expect(node.processPacket.notCalled).true;
    });

    it('sendPacket history updated', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        sinon.replaceGetter(node, 'state', () => 'the state');
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        network.registerNode(node);

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency);

        expect(history.add.calledWithMatch({ type: 'send', nodeState: 'the state' } as NetworkEvent)).true;
        expect(history.add.calledWithMatch({ type: 'receive' } as NetworkEvent)).true;
    });

    it('subscribeNodes callbacks called', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        sinon.replaceGetter(node, 'id', () => 'the id');
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();

        const nodeCallback = sinon.fake(() => {
            //do nothing
        });

        const dispose = network.subscribeNodes(nodeCallback as NetworkNodeCallback);

        network.registerNode(node);
        network.unregisterNode(node.id);
        network.unregisterNode(node.id);
        dispose();
        expect(nodeCallback.calledWith({ type: 'reg', node: node })).true;
        expect(nodeCallback.calledWith({ type: 'unreg', node: node })).true;
        expect(nodeCallback.callCount).equals(2);
    });

    it('subscribePackets callbacks called', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        sinon.replaceGetter(node, 'id', () => 'the id');
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);
        network.start();
        const packetCallback = sinon.fake(() => {
            //do nothing
        });

        const dispose = network.subscribePackets(packetCallback as NetworkPacketCallback);

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency);

        dispose();
        expect(packetCallback.calledWith({ type: 'sent', packet: packet })).true;
        expect(packetCallback.calledWith({ type: 'received', packet: packet })).true;
    });

    it('nodes returned', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const history = sinon.createStubInstance(NetworkHistory);
        const network = new Network(
            timeline as unknown as Timeline,
            history as unknown as NetworkHistory);

        network.registerNode(node);

        expect(network.nodes).deep.equals([node]);
    });
});