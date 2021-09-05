import { FunctionComponent } from 'react';
import './App.css';
import { PingPongVis } from './ping-pong/ping-pong-vis';

export const App: FunctionComponent = () => {
  return (
    <div className="App">
      <PingPongVis />
    </div>
  );
};
