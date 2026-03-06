import React from "react";
import { StatusBar, View } from "react-native";
import { PageHeaderConfig, PageLayoutProps } from "./layout.type";
import usePageLayout from "./usePageLayout";
import PageHeader from "./PageHeader";
import { styles } from "./layout.style";

export default function PageLayout(props: PageLayoutProps) {
  const layout = usePageLayout(props);

  const headerConfig: PageHeaderConfig = {
    state: props.headerState ?? "content",
    height: props.headerHeight ?? 48,
    containerStyle: props.headerContainerStyle,
    center: props.headerCenter,
    custom: props.customHeader,
  };

  return (
    <View style={styles.container}>
      <StatusBar
        hidden={props.statusBarHidden ?? false}
        barStyle={props.statusBarStyle ?? "dark-content"}
        translucent={props.statusBarTranslucent ?? true}
        backgroundColor={props.statusBarBackgroundColor ?? "transparent"}
      />

      <View style={[{ height: layout.topInset }, props.statusBarAreaStyle]} />

      <PageHeader config={headerConfig} layout={layout.header} />

      <View style={[styles.content, { paddingBottom: layout.bottomInset }, props.contentContainerStyle]}>
        {props.children}
      </View>
    </View>
  );
}
