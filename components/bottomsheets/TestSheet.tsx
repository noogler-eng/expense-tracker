import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { View } from "react-native";

export default function TestSheet() {
  return (
    <BottomSheet index={0} snapPoints={["50%"]}>
      <BottomSheetView>
        <View style={{ height: 400, backgroundColor: "red" }} />
      </BottomSheetView>
    </BottomSheet>
  );
}
