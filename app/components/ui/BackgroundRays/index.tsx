import { memo } from 'react';
import { ReactBitsParticlesBackground } from '../ParticlesBackground';

const BackgroundRays = memo(() => {
  return (
    <>
      {/* ReactBits.dev style particles background - complete replacement */}
      <ReactBitsParticlesBackground />
    </>
  );
});

BackgroundRays.displayName = 'BackgroundRays';

export default BackgroundRays;
