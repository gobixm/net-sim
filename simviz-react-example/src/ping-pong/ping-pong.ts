import { Network, NetworkHistory, Timeline, Node, constantLatencyProvider } from '@gobixm/sim';
import { HistoryView, NetworkView, NetworkViewOptions } from '@gobixm/simviz';

interface NodeState {
    counter: number;
}

interface PingBody {
    counter: number;
}

function addNode(id: string, network: Network): Node<NodeState> {
    const node = new Node<NodeState>(id, network, { counter: 0 });

    // node logic goes here
    node.registerHandler<PingBody>('ping', (packet, state) => {
        state.counter = packet.body.counter + 1;

        const otherNodes = network.nodes.filter(n => n.id !== node.id);
        const receiver = otherNodes[Math.floor(Math.random() * otherNodes.length)];
        node.send('pong', {}, packet.metadata.sender, undefined, 250);  // reply after 250 delay
        node.send('ping', { counter: state.counter } as PingBody, receiver, undefined, 500);    //send ping to random node after 500 delay
        return state;
    });

    network.registerNode(node);
    return node;
}

export function createNetwork(networkViewOptions: Partial<NetworkViewOptions>): {
    timeline: Timeline;
    history: NetworkHistory;
    network: Network;
    networkView: NetworkView;
    historyView: HistoryView;
} {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history, { latencyProvider: constantLatencyProvider(1000) });
    const networkView = new NetworkView(network, networkViewOptions);
    const historyView = new HistoryView(network, history);

    const alice = addNode('alice', network);
    const bob = addNode('bob', network);
    addNode('eve', network);

    alice.send<PingBody>('ping', { counter: 0 }, bob);

    return {
        timeline,
        history,
        network,
        networkView,
        historyView
    };
}