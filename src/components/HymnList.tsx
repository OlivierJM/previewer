import { List, Text, useMantineTheme } from "@mantine/core";
import { Hymn } from "../utils";
import { useEffect } from "react";

import { useColorScheme } from "../Context/ColorScheme";

export function HymnList({
    error,
    list,
    selectedItem,
    handleItemClick,
}: {
    error: string | null;
    list: Hymn[];
    selectedItem: number | null;
    handleItemClick: (hymnNumber: number) => void;
}) {
    useEffect(() => {
        let listItem = document.getElementById("hymn-" + selectedItem);
        if (listItem) {
            listItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedItem]);

    return (
        <List listStyleType="none" withPadding>
            {!error &&
                list?.map((item) => (
                    <HymnItem
                        key={item.number}
                        item={item}
                        selectedItem={selectedItem}
                        handleItemClick={handleItemClick}
                    />
                ))}
        </List>
    );
}

function HymnItem({
    item,
    selectedItem,
    handleItemClick,
}: {
    item: Hymn;
    selectedItem: number | null;
    handleItemClick: (hymnNumber: number) => void;
}) {
    const theme = useMantineTheme();
    let { colorScheme } = useColorScheme();

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
