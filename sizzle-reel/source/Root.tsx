import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
export const Root: React.FC = () => (
  <Composition id="Reel" component={Reel} durationInFrames={1335} fps={30} width={1080} height={1920} />
);
