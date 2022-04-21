import { defineAnimation } from "react-native-reanimated";

/**
 * Based on the _old_ withDecay animation from https://github.com/software-mansion/react-native-reanimated/blob/2.2.0/src/reanimated2/animations.ts#L353
 * Once we bring this into the app we should reimplement with a proper TS version from https://github.com/software-mansion/react-native-reanimated/blob/main/src/reanimated2/animation/decay.ts
 */
type Config = { modulus?: number; positive?: boolean; velocity?: number };
export default function withVelocity(userConfig: Config, callback = undefined) {
  "worklet";

  return defineAnimation(0, () => {
    "worklet";
    const config: Config = {};
    if (userConfig) {
      Object.keys(userConfig).forEach((key) => (config[key] = userConfig[key]));
    }

    function onFrame(animation, now) {
      const { lastTimestamp, current, velocity } = animation;

      const deltaTime = Math.min(now - lastTimestamp, 64);
      animation.current = current + (velocity * deltaTime) / 1000;
      animation.velocity = velocity;
      animation.lastTimestamp = now;

      if (config.modulus != null) {
        animation.current = animation.current % config.modulus;
        if (config.positive && animation.current < 0) {
          animation.current = config.modulus - animation.current;
        }
      }

      if (Math.abs(velocity) === 0) {
        return true;
      }
    }

    function onStart(animation, value, now) {
      animation.current = value;
      animation.lastTimestamp = now;
    }

    return {
      onFrame,
      onStart,
      velocity: config.velocity || 0,
      callback,
    };
  });
}
