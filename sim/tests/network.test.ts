import { Timeline } from './../src/timeline';
import { Network } from './../src/network';
import { Node } from './../src/node';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('network', () => {
    it('start subscribes to timeline', () => {
        const timeline = sinon.createStubInstance(Timeline);
        const network = new Network(timeline as unknown as Timeline);

        network.start();

        expect(timeline.subscribeTick.called).true
    });

    it('stop unsubscribes from timeline', () => {
        const timeline = sinon.createStubInstance(Timeline);
        timeline.subscribeTick.returns(() => {
            //do nothing
        });
        const network = new Network(timeline as unknown as Timeline);
        network.start();

        network.stop();

        expect(timeline.unsubscribeTick.called).true
    });

    it('start twice - single subscribe to timeline', () => {
        const timeline = sinon.createStubInstance(Timeline);
        timeline.subscribeTick.returns(() => {
            //do nothing
        });
        const network = new Network(timeline as unknown as Timeline);

        network.start();
        network.start();

        expect(timeline.subscribeTick.calledOnce).true
    });

    it('stop without start not unsubscribes', () => {
        const timeline = sinon.createStubInstance(Timeline);
        timeline.subscribeTick.returns(() => {
            //do nothing
        });
        const network = new Network(timeline as unknown as Timeline);

        network.stop();
        network.stop();

        expect(timeline.unsubscribeTick.notCalled).true
    });

    it('sendPacket packet created', () => {
        const timeline = new Timeline();
        const sender = sinon.createStubInstance(Node);
        const receiver = sinon.createStubInstance(Node);
        const network = new Network(timeline);
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
        const network = new Network(timeline);
        network.start();
        network.registerNode(node);

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency);

        expect(node.processPacket.calledOnceWith(packet)).true;
    });

    it('sendPacket no registered node, packet skipped', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const network = new Network(timeline);
        network.start();

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency);

        expect(node.processPacket.notCalled).true;
    });

    it('sendPacket too early, packet skipped', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const network = new Network(timeline);
        network.start();
        network.registerNode(node);

        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);
        timeline.tick(packet.metadata.latency - 1);

        expect(node.processPacket.notCalled).true;
    });

    it('sendPacket multiple packets processed', () => {
        const timeline = new Timeline();
        const node = sinon.createStubInstance(Node);
        const network = new Network(timeline);
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
        sinon.replaceGetter(node, 'id', () => 'the id')

        const network = new Network(timeline);
        network.start();
        network.registerNode(node);
        const packet = network.sendPacket<string>('msg', 'body', node as unknown as Node<string>, node as unknown as Node<string>);

        network.unregisterNode(node.id);
        timeline.tick(packet.metadata.latency);

        expect(node.processPacket.notCalled).true;
    });
});