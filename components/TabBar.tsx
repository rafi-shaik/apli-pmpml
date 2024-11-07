import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { icons } from "@/constants";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH / 3; // For 3 tabs

const TabBarImage = ({
  icon,
  isFocused,
}: {
  icon: ImageSourcePropType;
  isFocused: boolean;
}) => {
  return (
    <Image
      source={icon}
      style={[
        styles.tabIcon,
        { tintColor: isFocused ? "black" : "#838383" },
        isFocused && styles.focusedIcon,
      ]}
      resizeMode="contain"
    />
  );
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [state.index, slideAnim]);

  const iconImage = {
    index: (isFocused: boolean) => (
      <TabBarImage
        icon={isFocused ? icons.homeFilled : icons.homeOutline}
        isFocused={isFocused}
      />
    ),
    buses: (isFocused: boolean) => (
      <TabBarImage
        icon={isFocused ? icons.markerFilled : icons.markerOutline}
        isFocused={isFocused}
      />
    ),
    help: (isFocused: boolean) => (
      <TabBarImage
        icon={isFocused ? icons.questionFilled : icons.questionOutline}
        isFocused={isFocused}
      />
    ),
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.slider, { transform: [{ translateX: slideAnim }] }]}
      />
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
            onPress={onPress}
            style={styles.tabItem}
          >
            <View style={styles.tabContent}>
              {iconImage[route.name as keyof typeof iconImage]?.(isFocused)}
              <Text style={[styles.tabLabel, isFocused && styles.focusedLabel]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height:60
  },
  tabItem: {
    width: TAB_WIDTH,
    height: 60,
    overflow: "hidden",
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
  focusedIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 14,
    marginTop: 4,
    color: "#838383",
  },
  focusedLabel: {
    color: "black",
    fontWeight: 500,
  },
  slider: {
    position: "absolute",
    top: 0,
    left: 0,
    width: TAB_WIDTH,
    height: 2,
    backgroundColor: "#3fa1ae",
  },
});
