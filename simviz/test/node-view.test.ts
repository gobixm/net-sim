import { NodeView } from './../src/views/node-view';
import { INode } from '@gobixm/sim';
import { expect } from 'chai';

describe('packet view', () => {
    it('origin returned', () => {
        const nodeView = new NodeView({} as INode);
        const expectedOrigin = { x: 22, y: 33 };

        nodeView.move(expectedOrigin);

        expect(nodeView.origin).deep.equals(expectedOrigin);
    });

    it('state returned', () => {
        const nodeView = new NodeView({ state: 'state' } as INode);

        const state = nodeView.state;

        expect(state).equals('state');
    });
});