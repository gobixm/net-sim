import { PacketView } from './packet-view';
import { NodeView } from './node-view';
import { INode, Network, NetworkNodeEvent, NetworkPacketEvent, Packet } from '@gobixm/sim';

export interface NetworkViewOptions {
    readonly nodeArrageRadius: number,
    readonly nodeColorGenerator: (i: number, node: INode, network: Network) => string;
}

export const goldenAngleColorGenerator = (i: number): string => {
    const hue = i * 137.508;
    return `hsl(${hue},50%,75%)`;
};

const defaultOptions: NetworkViewOptions = {
    nodeArrageRadius: 400,
    nodeColorGenerator: goldenAngleColorGenerator
};

export class NetworkView {
    public get nodes(): readonly NodeView[] {
        return this._nodes;
    }

    public get packets(): readonly PacketView[] {
        return this._packets;
    }

    public get options(): NetworkViewOptions {
        return this._options;
    }

    private _nodes: NodeView[] = [];
    private _packets: PacketView[] = [];
    private _nodeSubscription: () => void;
    private _packetSubscription: () => void;
    private _options: NetworkViewOptions;
    private _nodeCounter = 0;

    private _nodesSubscriptions = new Set<() => void>();
    private _packetsSubscriptions = new Set<() => void>();

    constructor(
        private _netowork: Network,
        options: Partial<NetworkViewOptions> = {}
    ) {
        _netowork.nodes.forEach(node => this.addNode(node));
        this._nodeSubscription = _netowork.subscribeNodes(event => this.onNode(event));
        this._packetSubscription = _netowork.subscribePackets(event => this.onPacket(event));
        this._options = { ...defaultOptions, ...options };
    }

    destroy(): void {
        this._nodeSubscription();
        this._packetSubscription();
    }

    subscribeNodes(callback: () => void): () => void {
        this._nodesSubscriptions.add(callback);
        return () => this._nodesSubscriptions.delete(callback);
    }

    subscribePackets(callback: () => void): () => void {
        this._packetsSubscriptions.add(callback);
        return () => this._packetsSubscriptions.delete(callback);
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
        return new NodeView(node, {
            color: this._options.nodeColorGenerator(this._nodeCounter, node, this._netowork)
        });
    }

    private addNode(node: INode) {
        this._nodes = [...this._nodes, this.createNodeView(node)];
        this.arrangeNodes(this._options.nodeArrageRadius);
        this._nodeCounter++;
        this._nodesSubscriptions?.forEach(callback => callback());
    }

    private removeNode(node: INode) {
        this._nodes = this._nodes.filter(n => n.id !== node.id);
        this.arrangeNodes(this._options.nodeArrageRadius);
        this._nodesSubscriptions?.forEach(callback => callback());
    }

    private arrangeNodes(radius: number) {
        this._nodes.forEach((node, i) => {
            const x = Math.cos(Math.PI - i * 2 * Math.PI / this._nodes.length) * radius;
            const y = -Math.sin(Math.PI - i * 2 * Math.PI / this._nodes.length) * radius;
            node.move({ x, y });
        });
    }

    private findNodeView(id: string): NodeView | undefined {
        return this._nodes.find(nodeView => nodeView.id === id);
    }

    private onPacket(event: NetworkPacketEvent) {
        switch (event.type) {
            case 'sent':
                this.addPacket(event.packet);
                break;

            case 'received':
                this.removePacket(event.packet);
                break;
        }
    }

    private createPacketView(packet: Packet<unknown>): PacketView | undefined {
        const sender = this.findNodeView(packet.metadata.sender.id);
        const receiver = this.findNodeView(packet.metadata.receiver.id);
        if (!sender || !receiver) {
            return undefined;
        }
        return new PacketView(packet, sender, receiver);
    }

    private addPacket(packet: Packet<unknown>) {
        const newPacketView = this.createPacketView(packet);
        if (!newPacketView) {
            return;
        }

        this._packets = [...this._packets, newPacketView];
        this._packetsSubscriptions?.forEach(callback => callback());
    }

    private removePacket(packet: Packet<unknown>) {
        this._packets = this._packets.filter(p => p.id !== packet.metadata.id);
        this._packetsSubscriptions?.forEach(callback => callback());
    }
}