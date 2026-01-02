import Svg, { Circle, Path } from "react-native-svg";

const GenderIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="14" r="4" stroke="#6366F1" strokeWidth="2" />
    <Path d="M12 6v4M19 9l-2.5 2.5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <Path d="M19 4v5h-5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default GenderIcon;