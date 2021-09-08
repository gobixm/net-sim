import { Network, NetworkHistory, Timeline, Node } from '@gobixm/sim';
import { NetworkView, NetworkViewOptions } from '@gobixm/simviz';

interface NodeState {
    counter: number;
}

interface PingBody {
    counter: number;
}

interface PongBody {
    counter: number;
}

function addNode(id: string, network: Network): Node<NodeState> {
    const node = new Node<NodeState>(id, network, { counter: 0 });
    node.registerHandler<PongBody>('ping', (packet, state) => {
        state.counter = packet.body.counter + 1;

        const otherNodes = network.nodes.filter(n => n.id !== node.id);
        const receiver = otherNodes[Math.floor(Math.random() * otherNodes.length)];
        node.send('pong', { counter: state.counter } as PongBody, packet.metadata.sender);
        node.send('ping', { counter: state.counter } as PingBody, receiver);
        return state;
    });
    network.registerNode(node);
    return node;
}

export function createNetwork(networkViewOptions: NetworkViewOptions): {
    timeline: Timeline;
    history: NetworkHistory;
    network: Network;
    networkView: NetworkView;
} {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history);
    const networkView = new NetworkView(network, networkViewOptions);

    const alice = addNode('alice', network);
    const bob = addNode('bob', network);
    addNode('eve', network);

    alice.send<PingBody>('ping', { counter: 0 }, bob);

    return {
        timeline,
        history,
        network,
        networkView
    };
}