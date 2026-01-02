import Svg, { Path, Rect } from "react-native-svg";

const CalendarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="#EC4899"
      strokeWidth="2"
    />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default CalendarIcon;