import Svg, { Circle, Path } from "react-native-svg";

const UserIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="#8B5CF6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke="#8B5CF6" strokeWidth="2" />
  </Svg>
);

export default UserIcon;