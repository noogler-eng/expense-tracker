import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const color = "#E5E7EB";
const strokeWidth = 1.8;

export const HomeIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 10.5L12 4L20 10.5V20H4V10.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const AddFriendIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="8" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M3 20C3 16.5 6 14.5 9 14.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M17 8V14M14 11H20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const ReceiptIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3H18V21L15 19L12 21L9 19L6 21V3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M9 8H15M9 12H15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const ExpenseIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M16 7C16 5 8 5 8 7C8 9 16 9 16 11C16 13 8 13 8 15C8 17 16 17 16 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const HistoryIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 7V12L15 14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlusIcon = ({ size = 26, rotate = "0deg" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ transform: [{ rotate }] }}
    fill="none"
  >
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
