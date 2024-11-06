import TabBarImage from "./TabBarImage";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet, } from "react-native";

import { icons } from "@/constants";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const iconImage = {
    index: (props: any) => <TabBarImage icon={icons.home} props={props} />,
    "near-by": (props: any) => (
      <TabBarImage icon={icons.marker} props={props} />
    ),
    metro: (props: any) => <TabBarImage icon={icons.train} props={props} />,
    complaint: (props: any) => (
      <TabBarImage icon={icons.complaint} props={props} />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabBarItem}
          >
            {iconImage[route.name]({
              isFocused,
            })}
            <Text
              className={`${
                isFocused ? "text-black scale-110" : "text-[#838383"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderTopColor: "#838383",
    paddingVertical: 10,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
