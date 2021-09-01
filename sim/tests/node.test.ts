import { Network } from './../src/network';
import { Node } from './../src/node';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Packet } from '../src/packet';

describe('node', () => {
    it('get id', () => {
        const network = sinon.createStubInstance(Network);
        const node = new Node<unknown>('the id', network as unknown as Network, {});

        const id = node.id;

        expect(id).equal('the id');
    });

    it('registerHandler handler called', () => {
        const network = sinon.createStubInstance(Network);
        const context = { state: 'foo' };
        const node = new Node<{ state: string }>('the id', network as unknown as Network, context);
        const packet = new Packet<string>('request', 'body', {
            id: 1,
            latency: 2,
            sender: node,
            receiver: node,
            sentAt: 1
        });

        let calledPacket = undefined;
        let calledContext = undefined;
        node.registerHandler<string>('request', (packet, context) => {
            calledPacket = packet;
            calledContext = context;
            return { ...context };
        });


        node.processPacket(packet);
        expect(calledPacket).equal(packet);
        expect(calledContext).equal(context);
    });

    it('registerHandler unexpected packet type not processed', () => {
        const network = sinon.createStubInstance(Network);
        const context = 'state';
        const node = new Node<string>('the id', network as unknown as Network, context);
        const packet = new Packet<string>('not a request', 'body', {
            id: 1,
            latency: 2,
            sender: node,
            receiver: node,
            sentAt: 1
        });

        let calledPacket = undefined;
        let calledContext = undefined;
        node.registerHandler<string>('request', (packet, context) => {
            calledPacket = packet;
            calledContext = context
            return context;
        });

        node.processPacket(packet);
        expect(calledPacket).undefined
        expect(calledContext).undefined;
    });

    it('unregisterHandler packet not processed', () => {
        const network = sinon.createStubInstance(Network);
        const context = 'state';
        const node = new Node<string>('the id', network as unknown as Network, context);
        const packet = new Packet<string>('request', 'body', {
            id: 1,
            latency: 2,
            sender: node,
            receiver: node,
            sentAt: 1
        });

        let calledPacket = undefined;
        let calledContext = undefined;
        node.registerHandler<string>('request', (packet, context) => {
            calledPacket = packet;
            calledContext = context
            return context;
        });

        node.unregisterHandler('request');

        node.processPacket(packet);
        expect(calledPacket).undefined
        expect(calledContext).undefined;
    });

    it('registerHandler process modify context', () => {
        const network = sinon.createStubInstance(Network);
        const context = 0;
        const node = new Node<number>('the id', network as unknown as Network, context);
        const packet = new Packet<string>('request', 'body', {
            id: 1,
            latency: 2,
            sender: node,
            receiver: node,
            sentAt: 1
        });

        let calledContext = undefined;
        node.registerHandler<string>('request', (packet, context) => {
            const ctx = context + 1;
            calledContext = ctx;
            return ctx;
        });


        node.processPacket(packet);
        node.processPacket(packet);
        node.processPacket(packet);
        expect(calledContext).equal(3);
    });

    it('send network called', () => {
        const network = sinon.createStubInstance(Network);
        const context = 0;
        const node = new Node<number>('the id', network as unknown as Network, context);
        
        node.send<string>('request', 'body', node);
        
        expect(network.sendPacket.calledWith('request', 'body', node, node)).true;
    });
});