import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";
import { useTheme } from "@/hooks/use-theme";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs tintColor={colors.primary}>
      <NativeTabs.Trigger name="index">
        <Icon sf="arrow.down.circle.fill" />
        <Label>Download</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Icon sf="clock.fill" />
        <Label>History</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
