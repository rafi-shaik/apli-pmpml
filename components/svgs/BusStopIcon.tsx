import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const BusStopIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 18 18" fill="none">
    <Circle cx={9} cy={9} r={9} fill="#CC348B" />
    <Path
      fill="#fff"
      d="M6.057 13V4.273h3.051c.608 0 1.11.105 1.504.315.395.207.69.487.882.84.194.349.29.737.29 1.163 0 .375-.067.685-.2.929-.13.244-.304.437-.52.58a2.365 2.365 0 0 1-.695.315V8.5c.267.017.536.11.806.281.27.17.495.415.677.733.182.318.273.708.273 1.168 0 .437-.1.83-.298 1.18-.2.35-.513.627-.942.831-.429.205-.987.307-1.675.307H6.057Zm1.057-.938H9.21c.69 0 1.18-.133 1.47-.4.293-.27.44-.597.44-.98 0-.296-.076-.568-.226-.818a1.635 1.635 0 0 0-.644-.605c-.278-.154-.608-.23-.989-.23H7.114v3.034Zm0-3.954h1.96c.318 0 .605-.063.86-.188.26-.125.464-.3.614-.528.154-.227.23-.494.23-.801 0-.384-.133-.709-.4-.976-.267-.27-.69-.405-1.27-.405H7.114v2.898Z"
    />
  </Svg>
);
export default BusStopIcon;