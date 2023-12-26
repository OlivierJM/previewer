import { List } from "@mantine/core";
import { Hymn } from "../utils";
import HymnItem from "./HymnItem";
import { useEffect } from "react";

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
