import * as React from "react";
import Svg, { Path } from "react-native-svg";

const BusIcon = ({
  color,
  width = 22,
  height = 25,
}: {
  color: string;
  width?: number;
  height?: number;
}) => (
  <Svg width={width} height={height} viewBox="0 0 48 48">
    <Path fill="none" d="M0 0h48v48H0z" />
    <Path
      d="M8 32c0 1.77.78 3.34 2 4.44V40c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-2h16v2a2 2 0 0 0 2 2h2c1.1 0 2-.9 2-2v-3.56c1.22-1.1 2-2.67 2-4.44V12c0-7-7.16-8-16-8S8 5 8 12v20zm7 2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm18 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-12H12V12h24v10z"
      fill={color}
    />
  </Svg>
);
export default BusIcon;
