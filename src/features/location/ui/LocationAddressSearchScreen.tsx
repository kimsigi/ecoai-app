import { ActivityIndicator, Pressable, SectionList, View } from "react-native";
import { useLocationAddressSearch } from "../hook/useLocationAddressSearch";
import { locationAddressSearchStyles as styles  } from "../location.style";
import { LocationSearchResponse } from "../location.type";
import { AppIcon } from "@/shared/ui/component/icon";
import { PageLayout } from "@/shared/ui/component/layout";
import { HeaderInputDefault } from "@/shared/ui/component/header";
import { AppText } from "@/shared/ui/component/text";

export default function LocationAddressSearchScreen() {

    const {
        query,
        setQuery,
        loading,
        sections,
        emptyText,
        hasPlaceSection,
        onBackPress,
        onSubmit,
        onClear,
        onSelect,
        getDisplayText,
    } = useLocationAddressSearch();

    const renderRow = (item: LocationSearchResponse) => {

        const { mainTitle, smallLabel, subText } = getDisplayText(item);

        return (
            <Pressable style={styles.item} onPress={() => onSelect(item)}>
                <View style={styles.itemIconWrap}>
                    <AppIcon name="search" size={16} />
                </View>

                <View style={styles.itemTextWrap}>
                    <View style={styles.itemText}>
                        <AppText style={styles.itemMainTitle} numberOfLines={1}>
                            {mainTitle}
                        </AppText>

                        {!!smallLabel && (
                            <View style={styles.itemSmallLabelWrap}>
                                <AppText style={styles.itemSmallLabel} numberOfLines={1}>
                                    {smallLabel}
                                </AppText>
                            </View>
                        )}
                    </View>

                    {!!subText && (
                        <AppText style={styles.itemSubText} numberOfLines={1}>
                            {subText}
                        </AppText>
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <PageLayout
            customHeader={        
                <View style={styles.customHeader}>
                    <HeaderInputDefault
                        back
                        mode="input"
                        value={query}
                        autoFocus
                        multiline={true}
                        onBackPress={onBackPress}
                        onChangeText={setQuery}
                        onSubmit={onSubmit}
                        onClear={onClear}
                    />
                </View>
            }
        >
             {loading && (
                <View style={styles.activityIndicator}>
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
                    section.key === 'ADDRESS' && hasPlaceSection ? (
                        <View style={styles.sectionDivider} />
                    ) : null
                }
                ListEmptyComponent={
                    !loading ? <AppText style={styles.emptyText}>{emptyText}</AppText> : null
                }
                renderItem={({ item }) => renderRow(item)}
            />
        </PageLayout>
    );
}