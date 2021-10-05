import { HistoryView, NetworkView, NetworkViewOptions } from '@gobixm/simviz';
import { Network, NetworkHistory, Timeline, Node, Time, randomLatencyProvider } from '@gobixm/sim';

export interface SurveyReply {
    time: Time;
    term: number;
}

export interface Survey {
    term: number;
}

interface ServerState {
    times: Record<string, Time>;
    term: number;
}

function createSimulation(networkViewOptions: Partial<NetworkViewOptions>) {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history, { latencyProvider: randomLatencyProvider(200, 2000) });
    const networkView = new NetworkView(network, networkViewOptions);
    const historyView = new HistoryView(network, history);


    const alice = new Node<unknown>('alice', network, undefined);
    const bob = new Node<unknown>('bob', network, undefined);
    const eve = new Node<unknown>('eve', network, undefined);
    const server = new Node<ServerState>('server', network, { term: 0, times: {} });

    // client logic
    [alice, bob, eve].forEach(client => {
        client.registerHandler<Survey>('survey', (packet) => {
            const time = timeline.logicTime;
            network.sendPacket<SurveyReply>('resp', { term: packet.body.term, time }, client, packet.metadata.sender);
            return undefined;
        });
    });

    // server logic
    server.registerHandler<SurveyReply>('resp', (packet, state) => {
        if (packet.body.term === state.term) {
            const times = { ...state.times };
            times[packet.metadata.sender.id] = packet.body.time;
            return { ...state, times };
        }
        return state;
    });

    network.registerNode(server);
    network.registerNode(alice);
    network.registerNode(bob);
    network.registerNode(eve);

    return {
        timeline,
        history,
        network,
        networkView,
        historyView,
        sendSurvey: () => {
            server.state.term += 1;
            network.sendBroadcastPacket<Survey>('survey', { term: server.state.term }, server);
        }
    };
}

export const simulation = createSimulation({ nodeArrageRadius: 200 });