import { NodeView } from './node-view';
import { INode, Network, NetworkNodeEvent } from 'sim';

export interface NetworkViewOptions {
    readonly nodeArrageRadius: number
}

const defaultOptions: NetworkViewOptions = {
    nodeArrageRadius: 400
};

export class NetworkView {
    public get nodes(): readonly NodeView[] {
        return this._nodes;
    }

    public get options(): NetworkViewOptions {
        return this._options;
    }

    private _nodes: NodeView[] = [];
    private _nodeSubscription: () => void;
    private _options: NetworkViewOptions;

    constructor(
        private _netowork: Network,
        options: Partial<NetworkViewOptions> = {}
    ) {
        this._nodeSubscription = _netowork.subscribeNodes(event => this.onNode(event));
        this._options = { ...defaultOptions, ...options };
    }

    destroy(): void {
        this._nodeSubscription();
    }

    private onNode(event: NetworkNodeEvent) {
        switch (event.type) {
            case 'reg':
                this.addNode(event.node);
                break;

            case 'unreg':
                this.removeNode(event.node);
                break;
        }
    }

    private createNodeView(node: INode): NodeView {
        return new NodeView(node);
    }

    private addNode(node: INode) {
        this._nodes = [...this.nodes, this.createNodeView(node)];
        this.arrangeNodes(this._options.nodeArrageRadius);
    }

    private removeNode(node: INode) {
        this._nodes = this.nodes.filter(n => n.id != node.id);
        this.arrangeNodes(this._options.nodeArrageRadius);
    }

    private arrangeNodes(radius: number) {
        this._nodes.forEach((node, i) => {
            const x = Math.cos(Math.PI - i * 2 * Math.PI / this._nodes.length) * radius;
            const y = -Math.sin(Math.PI - i * 2 * Math.PI / this._nodes.length) * radius;
            node.move({x, y});
        });
    }
}