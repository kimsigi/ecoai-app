import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SearchNavHeader from "@/shared/ui/component/header/SearchNavHeader";
import SearchIcon from "@/shared/ui/assets/icon/search.svg";
import { FALLBACK } from "@/shared/core/config";
import { StackParamList } from "@/app/app.route";
import { locationSearch } from "../location.api";
import { LOCATION_SEARCH_TYPE } from "../location.constant";
import { getLocation } from "../location.service";
import {
  LocationAddressSearchParams,
  LocationSearchResponse,
} from "../location.type";
import { addressSearchStyles as styles } from "../location.style";

type ResultSection = {
  key: "ADDRESS" | "PLACE";
  data: LocationSearchResponse[];
};

function formatDistance(distance?: number | null): string {
  if (!distance || distance <= 0) return "";
  if (distance < 1000) return `${Math.round(distance)}m`;
  return `${(distance / 1000).toFixed(1)}km`;
}

function getLastCategoryDepth(categoryName?: string | null): string {
  if (!categoryName) return "";
  const parts = categoryName
    .split(">")
    .map((v) => v.trim())
    .filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function getMainTitle(item: LocationSearchResponse): string {
  if (item.type === LOCATION_SEARCH_TYPE.ADDRESS) {
    return item.roadAddressName || item.addressName || "";
  }
  return item.placeName || item.roadAddressName || item.addressName || "";
}

function getSmallLabel(item: LocationSearchResponse): string {
  if (item.type === LOCATION_SEARCH_TYPE.ADDRESS) return "도로명";
  return getLastCategoryDepth(item.categoryName);
}

export default function LocationAddressSearchScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const params = route.params as LocationAddressSearchParams | undefined;

  const addressName = params?.addressName ?? "";
  const [query, setQuery] = useState(addressName);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LocationSearchResponse[]>([]);

  const baseCoord = useMemo(() => {
    const saved = getLocation();
    return {
      lat: saved?.y ?? FALLBACK.MAP_LAT,
      lng: saved?.x ?? FALLBACK.MAP_LNG,
    };
  }, []);

  const runSearch = useCallback(
    async (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed) {
        setItems([]);
        return;
      }

      try {
        setLoading(true);
        const result = await locationSearch({
          query: trimmed,
          lat: baseCoord.lat,
          lng: baseCoord.lng,
        });
        setItems(result ?? []);
      } catch (error) {
        console.warn("주소 검색 실패:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [baseCoord.lat, baseCoord.lng]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  const sections = useMemo<ResultSection[]>(() => {
    const addressItems = items.filter(
      (item) => item.type === LOCATION_SEARCH_TYPE.ADDRESS
    );
    const placeItems = items.filter(
      (item) => item.type === LOCATION_SEARCH_TYPE.PLACE
    );

    const next: ResultSection[] = [];
    if (addressItems.length > 0) next.push({ key: "ADDRESS", data: addressItems });
    if (placeItems.length > 0) next.push({ key: "PLACE", data: placeItems });
    return next;
  }, [items]);

  const onSelect = (item: LocationSearchResponse) => {
    params?.callback?.({
      lat: item.y,
      lng: item.x,
      addressName: item.type === LOCATION_SEARCH_TYPE.ADDRESS 
                 ? item.roadAddressName || item.addressName 
                 : item.placeName,
    });
    navigation.goBack();
  };

  const renderRow = (item: LocationSearchResponse) => {
    const mainTitle = getMainTitle(item);
    const smallLabel = getSmallLabel(item);

    const subText =
      item.type === LOCATION_SEARCH_TYPE.PLACE
        ? [formatDistance(item.distance), item.roadAddressName || item.addressName]
            .filter(Boolean)
            .join(" · ")
        : item.addressName;

    return (
      <Pressable style={styles.item} onPress={() => onSelect(item)}>
        <View style={styles.iconWrap}>
          <SearchIcon width={16} height={16} />
        </View>

        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={1}>
              {mainTitle}
            </Text>
            {!!smallLabel && (
              <Text style={styles.smallLabel} numberOfLines={1}>
                {smallLabel}
              </Text>
            )}
          </View>

          {!!subText && (
            <Text style={styles.subText} numberOfLines={1}>
              {subText}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]}>
        <SearchNavHeader
          mode="input"
          value={query}
          autoFocus
          onBackPress={() => navigation.goBack()}
          onChangeText={setQuery}
          onSubmit={() => runSearch(query)}
          onClear={() => setQuery("")}
        />
      </View>

      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.type}-${item.x}-${item.y}-${index}`}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled={false}
        renderSectionHeader={() => null}
        renderSectionFooter={({ section }) =>
          section.key === "ADDRESS" && sections.some((s) => s.key === "PLACE") ? (
            <View style={styles.sectionDivider} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              {query.trim() ? "검색 결과가 없습니다." : "주소를 입력해 주세요."}
            </Text>
          ) : null
        }
        renderItem={({ item }) => renderRow(item)}
      />
    </View>
  );
}
