import { memo } from 'react';
import { useStore } from '@nanostores/react';
import { ReactBitsParticlesBackground } from '~/components/ui/ParticlesBackground';
import { WavesBackground } from '~/components/ui/WavesBackground';
import { dynamicThemeStore, dynamicThemeEnabledStore } from '~/lib/stores/theme';

const BackgroundRays = memo(() => {
  const currentTheme = useStore(dynamicThemeStore);
  const isDynamicThemeEnabled = useStore(dynamicThemeEnabledStore);

  // Show waves background when nebula theme is active
  const showWavesBackground = isDynamicThemeEnabled && currentTheme === 'nebula';

  return (
    <>
      {showWavesBackground ? (
        /* Beautiful waves background for enhanced visibility */
        <WavesBackground intensity="medium" speed="normal" />
      ) : (
        /* ReactBits.dev style particles background - default */
        <ReactBitsParticlesBackground />
      )}
    </>
  );
});

BackgroundRays.displayName = 'BackgroundRays';

export default BackgroundRays;
