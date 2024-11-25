import * as React from "react";
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text,
} from "react-native-svg";

const WhiteBusIcon = ({ title }: { title: string }) => (
  <Svg width={35} height={20} viewBox="0 0 40 20" fill="none">
    <Path
      fill="#000"
      d="M34 19a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1h7ZM10 19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1h7ZM34 1a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1h7ZM10 1a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1h7Z"
    />
    <Path
      fill="#fff"
      d="M37.057.5c.56 0 1.052.367 1.213.903 1.78 5.934 1.78 11.26 0 17.195-.16.535-.654.902-1.213.902H2a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2h35.058Z"
    />
    <Path
      fill="#000"
      d="m36 1-1 1h-5V1h6ZM29 1v1h-6V1h6ZM22 1v1h-6V1h6ZM15 1v1H9V1h6ZM8 1v1H3L2 1h6Z"
    />
    <Path
      fill="#fff"
      d="m33.5 2-1-1h-1l1 1h1ZM13.5 2l-1-1h-1l1 1h1Z"
      opacity={0.3}
    />
    <Path
      fill="#000"
      d="m36 19-1-1h-5v1h6ZM29 19v-1h-6v1h6ZM22 19v-1h-6v1h6ZM15 19v-1H9v1h6ZM8 19v-1H3l-1 1h6Z"
    />
    <Path
      fill="#fff"
      d="m26.5 19-1-1h-1l1 1h1ZM6.5 19l-1-1h-1l1 1h1Z"
      opacity={0.3}
    />
    <Path fill="#000" d="M0 2.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1v-15Z" />
    <Path
      fill="url(#a)"
      d="M38.3 18.5c1.74-5.873 1.74-11.126 0-17-.719 0-2.3.582-2.3 1.3v14.4c0 .718 1.581 1.3 2.3 1.3Z"
    />
    <Path
      fill="#AAA"
      d="M39.5 18.5a.5.5 0 0 1 0 1H37v-1h2.5ZM39.5.5a.5.5 0 0 1 0 1H37v-1h2.5Z"
    />
    <Path fill="#fff" d="m0 6.5 1 1v3l-1-1v-3Z" opacity={0.3} />
    <Text
      fill="black"
      fontSize="10"
      textAnchor="middle"
      alignmentBaseline="middle"
      x="20"
      y="10"
    >
      {title}
    </Text>
    <Defs>
      <LinearGradient
        id="a"
        x1={39.605}
        x2={36.999}
        y1={10.5}
        y2={10.5}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A0A0A0" />
        <Stop offset={1} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default WhiteBusIcon;
