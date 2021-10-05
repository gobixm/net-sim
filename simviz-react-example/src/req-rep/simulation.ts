import { HistoryView, NetworkView, NetworkViewOptions } from '@gobixm/simviz';
import { constantLatencyProvider, Network, NetworkHistory, Timeline, Node } from '@gobixm/sim';

export interface Request {
    word: string;
}

export interface Response {
    reverse: string;
}

function createSimulation(networkViewOptions: Partial<NetworkViewOptions>) {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history, { latencyProvider: constantLatencyProvider(1000) });
    const networkView = new NetworkView(network, networkViewOptions);
    const historyView = new HistoryView(network, history);


    const client = new Node<unknown>('client', network, undefined);
    const server = new Node<unknown>('server', network, undefined);

    // server logic
    server.registerHandler<Request>('req', (packet, state) => {
        const reverse = packet.body.word.split('').reverse().join('');
        server.send<Response>('resp', { reverse }, packet.metadata.sender, 500);
        return state;
    });

    network.registerNode(client);
    network.registerNode(server);

    return {
        timeline,
        history,
        network,
        networkView,
        historyView,
        sendWord: (word: string) => client.send<Request>('req', {word}, server, 500)
    };
}

export const simulation = createSimulation({nodeArrageRadius: 200});