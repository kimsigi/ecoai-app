import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF"
  },
  top: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLarge: {
    width: "70%",
    height: "70%",
  },
  imageXL: {
    width: "80%",
    height: "80%",
  },
  imageLogo: {
    width: "45%",
    height: "45%",
  },
});