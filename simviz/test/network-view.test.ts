import { NodeView, NodeViewOptions } from './../src/views/node-view';
import { NetworkView, NetworkViewOptions } from './../src/views/network-view';
import { Network, NetworkHistory, Node, Timeline } from '@gobixm/sim';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('network view', () => {
    it('arranges on new node', () => {
        const timeline = new Timeline();
        const network = new Network(timeline, new NetworkHistory());
        const nodes = Array(5).fill(0).map((_, i) => new Node<string>(i.toString(), network, 'state'));
        const radius = 333;
        const networkView = new NetworkView(network, { nodeArrageRadius: radius });
        nodes.forEach(n => network.registerNode(n));
        network.unregisterNode(nodes[4].id);

        networkView.destroy();
        const nodeViews = networkView.nodes;
        expect(Math.round(nodeViews[0].x)).equals(-radius);
        expect(Math.round(nodeViews[0].y)).equals(0);

        expect(Math.round(nodeViews[1].x)).equals(0);
        expect(Math.round(nodeViews[1].y)).equals(-radius);

        expect(Math.round(nodeViews[2].x)).equals(radius);
        expect(Math.round(nodeViews[2].y)).equals(0);

        expect(Math.round(nodeViews[3].x)).equals(0);
        expect(Math.round(nodeViews[3].y)).equals(radius);
    });

    it('options default returned', () => {
        const network = sinon.createStubInstance(Network);
        const networkView = new NetworkView(network as unknown as Network);

        const options = networkView.options;

        expect(options).deep.equals(<NetworkViewOptions>{
            nodeArrageRadius: 400
        });
    });

    it('packets added', () => {
        const timeline = new Timeline();
        const network = new Network(timeline, new NetworkHistory());
        network.start();
        const networkView = new NetworkView(network);
        const node1 = new Node<string>('1', network, 'state');
        const node2 = new Node<string>('2', network, 'state');
        network.registerNode(node1);
        network.registerNode(node2);

        const packet = node1.send<string>('foo', 'body', node2, 0);

        network.stop();
        networkView.destroy();
        expect(networkView.packets.length).equal(1);
        expect(networkView.packets[0].id).equal(packet.metadata.id);
    });

    it('packets removed', () => {
        const timeline = new Timeline();
        const network = new Network(timeline, new NetworkHistory());
        network.start();
        const networkView = new NetworkView(network);
        const node1 = new Node<string>('1', network, 'state');
        const node2 = new Node<string>('2', network, 'state');
        network.registerNode(node1);
        network.registerNode(node2);

        node1.send<string>('foo', 'body', node2, 0);
        timeline.tick(1);

        network.stop();
        networkView.destroy();
        expect(networkView.packets.length).equal(0);
    });

    it('packet with missing sender or receiver not added', () => {
        const timeline = new Timeline();
        const network = new Network(timeline, new NetworkHistory());
        network.start();
        const networkView = new NetworkView(network);
        const node1 = new Node<string>('1', network, 'state');
        const node2 = new Node<string>('2', network, 'state');

        node1.send<string>('foo', 'body', node1, 0);
        node1.send<string>('foo', 'body', node2, 0);

        network.stop();
        networkView.destroy();
        expect(networkView.packets).empty;
    });

    it('default options', () => {
        const node1 = new Node<string>('1', undefined as unknown as Network, 'state');

        const nodeView = new NodeView(node1);


        expect(nodeView.options).deep.equal(<NodeViewOptions>{
            radius: 40
        });
    });
});