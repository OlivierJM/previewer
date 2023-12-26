import { useEffect, useState } from "react";
import { Center, Container, Space, TextInput, Textarea } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor, Editor as ReactEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import {
    IconArrowBackUp,
    IconArrowForwardUp,
    IconCode,
    IconColorPicker,
} from "@tabler/icons-react";
import { Markdown } from "tiptap-markdown";

import { InvalidHymnMessage, NoHymnMessage } from "./HymnPreview";
import { Hymn, useDebouncedAction } from "../utils";

export default function HymnEditor({
    currentHymn,
    updateHymn,
}: {
    currentHymn?: Hymn;
    updateHymn: (updater: (oldValue: Hymn) => Hymn) => void;
}) {
    if (!currentHymn) {
        return (
            <Center>
                <NoHymnMessage />
            </Center>
        );
    }

    let [editingRawCode, setEditingRawCode] = useState(false);

    let hymn: { text: string; format: "html" | "markdown" } | null =
        currentHymn?.content
            ? { text: currentHymn.content, format: "html" }
            : currentHymn?.markdown
            ? { text: currentHymn.markdown, format: "markdown" }
            : null;

    if (!hymn) {
        return (
            <Center>
                <InvalidHymnMessage selectedHymn={currentHymn} />
            </Center>
        );
    }

    const getEditorContent = (editor: Editor) =>
        hymn?.format === "html"
            ? editor?.getHTML()
            : (editor?.storage.markdown.getMarkdown() as string);

    let delay = useDebouncedAction();

    const updateHymnContent = (content: string) =>
        delay(() => {
            if (hymn?.format === "html") {
                updateHymn((oldValue) => ({
                    ...oldValue,
                    content: content,
                }));
            } else {
                updateHymn((oldValue) => ({
                    ...oldValue,
                    markdown: content,
                }));
            }
        }, 1000);

    const editor = useEditor(
        {
            extensions:
                hymn.format === "html"
                    ? [StarterKit, TextStyle, Color]
                    : [StarterKit, Markdown],
            content: hymn.text,
            onUpdate: (editor) => {
                updateHymnContent(getEditorContent(editor.editor));
            },
        },
        [currentHymn.number]
    );

    return (
        <Container>
            <TitleInput
                hymnNumber={currentHymn.number}
                title={currentHymn.title}
                updateTitle={(title) =>
                    updateHymn((oldValue) => ({ ...oldValue, title }))
                }
            />
            <Space h={16} />
            {!editingRawCode ? (
                <FullEditor
                    editor={editor as ReactEditor}
                    format={hymn.format}
                    setEditingRawCode={setEditingRawCode}
                />
            ) : (
                <RawCodeEditor
                    initialValue={getEditorContent(editor as Editor)}
                    setEditingRawCode={setEditingRawCode}
                    onUpdate={(text) => {
                        editor?.commands.setContent(text);
                        updateHymnContent(text);
                    }}
                />
            )}
        </Container>
    );
}

function TitleInput({
    hymnNumber,
    title,
    updateTitle,
}: {
    title: string;
    hymnNumber: number;
    updateTitle: (title: string) => void;
}) {
    let [value, setValue] = useState(title);
    let delay = useDebouncedAction();

    useEffect(() => setValue(title), [hymnNumber]);
    useEffect(() => delay(() => updateTitle(value), 1000), [value]);

    return (
        <TextInput
            size="lg"
            placeholder="Hymn title"
            value={value}
            onInput={(event) =>
                setValue((event.target as HTMLInputElement).value)
            }
        />
    );
}

function FullEditor({
    editor,
    format,
    setEditingRawCode,
}: {
    editor: ReactEditor;
    format: "html" | "markdown";
    setEditingRawCode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control
                        title="Edit raw code"
                        onClick={() => setEditingRawCode(true)}
                    >
                        <IconCode size={16} />
                    </RichTextEditor.Control>
                    <RichTextEditor.Control
                        title="Undo"
                        disabled={!editor?.can().undo()}
                        onClick={() => editor?.commands.undo()}
                    >
                        <IconArrowBackUp size={16} />
                    </RichTextEditor.Control>
                    <RichTextEditor.Control
                        title="Redo"
                        disabled={!editor?.can().redo()}
                        onClick={() => editor?.commands.redo()}
                    >
                        <IconArrowForwardUp size={16} />
                    </RichTextEditor.Control>
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.ClearFormatting />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                </RichTextEditor.ControlsGroup>

                {format === "html" ? (
                    <>
                        <RichTextEditor.ColorPicker
                            colors={[
                                "#25262b",
                                "#868e96",
                                "#fa5252",
                                "#e64980",
                                "#be4bdb",
                                "#7950f2",
                                "#4c6ef5",
                                "#228be6",
                                "#15aabf",
                                "#12b886",
                                "#40c057",
                                "#82c91e",
                                "#fab005",
                                "#fd7e14",
                            ]}
                        />

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Control interactive={false}>
                                <IconColorPicker size="1rem" stroke={1.5} />
                            </RichTextEditor.Control>
                            <RichTextEditor.Color color="#37B24D" />
                            <RichTextEditor.Color color="#F0B323" />
                            <RichTextEditor.UnsetColor />
                        </RichTextEditor.ControlsGroup>
                    </>
                ) : null}
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content
                style={{
                    fontFamily: "'Nunito', var(--mantine-font-family)",
                }}
            />
        </RichTextEditor>
    );
}

function RawCodeEditor({
    initialValue,
    setEditingRawCode,
    onUpdate,
}: {
    initialValue: string;
    setEditingRawCode: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdate: (text: string) => void;
}) {
    let [value, setValue] = useState(initialValue);
    useEffect(() => setValue(initialValue), [initialValue]);

    return (
        <RichTextEditor editor={null}>
            <RichTextEditor.Toolbar>
                <RichTextEditor.Control
                    title="Enable rich text editor"
                    onClick={() => {
                        onUpdate(value);
                        setEditingRawCode(false);
                    }}
                >
                    <IconCode size={16} />
                </RichTextEditor.Control>
            </RichTextEditor.Toolbar>
            <Textarea
                placeholder="Hymn text as code"
                rows={20}
                value={value}
                onInput={(event) =>
                    setValue((event.target as HTMLTextAreaElement).value)
                }
                onBlur={() => onUpdate(value)}
            />
        </RichTextEditor>
    );
}
