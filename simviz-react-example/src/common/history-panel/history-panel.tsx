
import { FunctionComponent } from 'react';
import { HistoryVis } from '@gobixm/simviz-react';
import { HistoryView } from '@gobixm/simviz';
import { Network } from '@gobixm/sim';

import styles from './history-panel.module.css';

export interface HistoryPanelProps {
    readonly network: Network
    readonly historyView: HistoryView;
}

export const HistoryPanel: FunctionComponent<HistoryPanelProps> = ({ network, historyView }) => {
    return (
        <div className={styles.host}>
            <HistoryVis history={historyView} network={network} />
        </div>
    );
};