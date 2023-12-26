import { Alert, Center, Code, TypographyStylesProvider } from "@mantine/core";
import ReactMarkdown from "react-markdown";

import classes from "./HymnPreview.module.css";
import { Hymn } from "../utils";
import { IconInfoCircle } from "@tabler/icons-react";

export default function HymnPreview({ selectedItem }: { selectedItem?: Hymn }) {
    return (
        <Center>
            {selectedItem ? (
                <TypographyStylesProvider className={classes.preview}>
                    {selectedItem?.content ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: selectedItem.content || "",
                            }}
                        />
                    ) : selectedItem?.markdown ? (
                        <ReactMarkdown>{selectedItem.markdown}</ReactMarkdown>
                    ) : (
                        <InvalidHymnMessage selectedHymn={selectedItem} />
                    )}
                </TypographyStylesProvider>
            ) : (
                <NoHymnMessage />
            )}
        </Center>
    );
}

export function InvalidHymnMessage({ selectedHymn }: { selectedHymn: Hymn }) {
    return (
        <Alert
            variant="light"
            color="red"
            title="Invalid hymn"
            icon={<IconInfoCircle />}
        >
            This hymn (number {selectedHymn.number}) does not have a valid{" "}
            <Code>markdown</Code> or <Code>content</Code> key
        </Alert>
    );
}

export function NoHymnMessage() {
    return (
        <Alert
            variant="light"
            color="gray"
            title="No hymn selected"
            icon={<IconInfoCircle />}
        >
            There is no hymn with the selected number
        </Alert>
    );
}
