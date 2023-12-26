import { useEffect, useState } from "react";
import { AppShell } from "@mantine/core";
import { useDebounceCallback, useDisclosure } from "@mantine/hooks";

import { Hymn, downloadJsonFile, useDebouncedAction } from "./utils";
import HymnPreview from "./components/HymnPreview";
import FileUploadArea from "./components/FileUploadArea";
import { AppHeader } from "./components/AppHeader";
import { HymnList } from "./components/HymnList";
import FloatingButtons from "./components/FloatingButtons";
import HymnEditor from "./components/HymnEditor";

export type HymnMap = Record<number, Hymn>;

export default function PreviewContainer() {
    const [selectedItem, setSelectedItem] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [originalHymns, setOriginalHymns] = useState<Hymn[] | null>(null);
    const [editedHymns, setEditedHymns] = useState<HymnMap | null>(null);
    const [editing, setEditing] = useState(false);
    const [drawerOpened, { toggle }] = useDisclosure();
    const [fileName, setFileName] = useState("hymnal.json");

    useEffect(() => {
        document.body.scrollIntoView({ behavior: "smooth" });
    }, [selectedItem]);

    const handleLoadedData = (jsonData: Hymn[], fileName: string) => {
        setOriginalHymns(jsonData);
        setEditedHymns(
            jsonData.reduce(
                (accumulator, current) => ({
                    ...accumulator,
                    [current.number]: current,
                }),
                {}
            )
        );
        setSelectedItem(jsonData[0].number);
        setError(null);
        setFileName(fileName);
    };

    const handleItemClick = (hymnNumber: number) => {
        if (drawerOpened) {
            toggle();
        }
        setSelectedItem(hymnNumber);
    };

    if (!editedHymns) {
        return (
            <FileUploadArea
                error={error}
                handleLoadedData={handleLoadedData}
                setError={setError}
            />
        );
    }

    const selectedHymn = editedHymns[selectedItem];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !drawerOpened },
            }}
            padding="md"
        >
            <AppHeader
                drawerOpened={drawerOpened}
                toggle={toggle}
                selectedHymn={selectedHymn}
                hymns={editedHymns}
                toggleEditing={() => setEditing((value) => !value)}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
            />
            <AppShell.Navbar p="md" style={{ overflow: "scroll" }}>
                <HymnList
                    error={error}
                    list={Object.values(editedHymns)}
                    selectedItem={selectedItem}
                    handleItemClick={handleItemClick}
                />
            </AppShell.Navbar>
            <AppShell.Main>
                {editing ? (
                    <HymnEditor
                        currentHymn={selectedHymn}
                        updateHymn={(updater) =>
                            setEditedHymns((hymn) =>
                                hymn
                                    ? {
                                          ...hymn,
                                          [selectedHymn.number]: updater(
                                              hymn[selectedHymn.number]
                                          ),
                                      }
                                    : hymn
                            )
                        }
                    />
                ) : (
                    <HymnPreview selectedItem={selectedHymn} />
                )}
                <FloatingButtons
                    uploadAnotherFile={() => {
                        setOriginalHymns(null);
                        setSelectedItem(1);
                        setEditedHymns(null);
                    }}
                    downloadJson={() =>
                        downloadJsonFile(
                            Object.values(editedHymns).sort(
                                (a, b) => a.number - b.number
                            ),
                            fileName
                        )
                    }
                />
            </AppShell.Main>
        </AppShell>
    );
}
