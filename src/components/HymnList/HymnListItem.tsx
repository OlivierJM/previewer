import { List, Text, useMantineTheme } from "@mantine/core";
import { Hymn } from "../../utils";
import { useColorScheme } from "../../Context/ColorScheme";

export function HymnListItem({
    item,
    selectedItem,
    handleItemClick,
}: {
    item: Hymn;
    selectedItem: number | null;
    handleItemClick: (hymnNumber: number) => void;
}) {
    const theme = useMantineTheme();
    const { colorScheme } = useColorScheme();

    return (
        <List.Item
            id={"hymn-" + item.number}
            onClick={() => handleItemClick(item.number)}
            style={{
                cursor: "pointer",
                "--hover-color":
                    theme.colors.gray[colorScheme === "dark" ? 9 : 0],
                backgroundColor:
                    selectedItem === item.number
                        ? theme.colors.gray[colorScheme === "dark" ? 8 : 1]
                        : "transparent",
                paddingLeft: theme.spacing.md,
                paddingTop: theme.spacing.xs,
                paddingBottom: theme.spacing.xs,
                // borderLeft: `3px solid ${theme.colors.blue[6]}`,
                borderRadius: theme.radius.sm,
                marginBottom: theme.spacing.xs,
            }}
        >
            <Text
                style={{
                    fontWeight:
                        selectedItem === item.number ? "bold" : "normal",
                }}
            >
                {item.title}
            </Text>
        </List.Item>
    );
}
