import { NetworkView, NetworkViewOptions } from './../src/views/network-view';
import { Network, NetworkNodeCallback, Node } from '@gobixm/sim';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('network view', () => {
    it('arranges on new node', () => {
        let nodesCallback: NetworkNodeCallback = () => {
            //
        };
        const network = sinon.createStubInstance(Network);
        const nodes = Array(5).fill(0).map((_, i) => {
            const node = sinon.createStubInstance(Node);
            sinon.replaceGetter(node, 'id', () => i.toString());
            return node;
        });
        network.subscribeNodes.callsFake((callback) => {
            nodesCallback = callback;
            return () => {
                //
            };
        });
        const radius = 333;
        const networkView = new NetworkView(network as unknown as Network, { nodeArrageRadius: radius });

        nodes.forEach(n => nodesCallback.apply(networkView, [{ type: 'reg', node: n }]));
        nodesCallback.apply(networkView, [{ type: 'unreg', node: nodes[4] }]);

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
});