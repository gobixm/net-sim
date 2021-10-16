import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import {
  BrowserRouter, Link as RouterLink, Route
} from 'react-router-dom';
import { PingPongVis } from './ping-pong/ping-pong-vis';
import styles from './App.module.css';
import { RequestReply } from './req-rep/req-rep';
import { Survey } from './survey/survey';
import { PubSub } from './pub-sub/pub-sub';
import { Bgp } from './bgp/bgp';

export const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Network Simulator
          </Typography>
          <Typography component="div" sx={{ flexGrow: 1 }}>
            You can click on Node to view it state.
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.main}>
        <nav className={styles.navPane}>
          <Typography variant="h6" component="div">
            Patterns
          </Typography>
          <Button>
            <RouterLink to="/req-rep" style={{ textDecoration: 'none' }}>
              Request-Reply
            </RouterLink>
          </Button>
          <Button>
            <RouterLink to="/pub-sub" style={{ textDecoration: 'none' }}>
              Pub-Sub
            </RouterLink>
          </Button>
          <Button>
            <RouterLink to="/survey" style={{ textDecoration: 'none' }}>
              Survey
            </RouterLink>
          </Button>
          <Button>
            <RouterLink to="/bgp" style={{ textDecoration: 'none' }}>
              Byzantine Generals
            </RouterLink>
          </Button>
          <Button>
            <RouterLink to="/ping-pong" style={{ textDecoration: 'none' }}>
              Ping Pong
            </RouterLink>
          </Button>
        </nav>
        <div className={styles.page}>
          <Route path="/" exact component={RequestReply} />
          <Route path="/ping-pong" exact component={PingPongVis} />
          <Route path="/req-rep" exact component={RequestReply} />
          <Route path="/pub-sub" exact component={PubSub} />
          <Route path="/survey" exact component={Survey} />
          <Route path="/bgp" exact component={Bgp} />
        </div>
      </div>
    </BrowserRouter >
  );
};
