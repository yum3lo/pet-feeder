import { Animated } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const GLOW_SIZE = 90;

type Props = {
  glowScale: Animated.AnimatedInterpolation<number>;
  glowOpacity: Animated.AnimatedInterpolation<number>;
};

export default function GlowEffect({ glowScale, glowOpacity }: Props) {
  return (
    <AnimatedSvg
      width={GLOW_SIZE}
      height={GLOW_SIZE}
      style={[
        { position: 'absolute' },
        { transform: [{ scale: glowScale }], opacity: glowOpacity },
      ]}
    >
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="40%" stopColor="#FFFFFF" stopOpacity={0.7} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#glow)" />
    </AnimatedSvg>
  );
}
