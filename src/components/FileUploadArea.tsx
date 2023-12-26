import {
    Text,
    Button,
    Container,
    FileButton,
    Code,
    Input,
    Grid,
    Space,
} from "@mantine/core";
import { useState, ChangeEvent } from "react";

import classes from "./FileUploadArea.module.css";
import { Hymn, getFilenameFromResponse } from "../utils";

type FileUploadAreaProps = {
    error: string | null;
    handleLoadedData: (jsonData: Hymn[], fileName: string) => void;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const FileUploadArea = ({
    error,
    handleLoadedData,
    setError,
}: FileUploadAreaProps) => {
    const [url, setUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const validateJson = (jsonData: Hymn[]) => {
        if (!Array.isArray(jsonData)) {
            throw new Error(
                "Invalid JSON format. contents of this JSON file must be an array."
            );
        }
        for (const item of jsonData) {
            if ((item.title && item.content) || item.markdown) {
                if (item.content && typeof item.content !== "string") {
                    throw new Error(
                        `Invalid JSON format. "content" property of item with title "${item.title}" must be a string.`
                    );
                }

                if (item.markdown && typeof item.markdown !== "string") {
                    throw new Error(
                        `Invalid JSON format. "markdown" property of item with title "${item.title}" must be a string.`
                    );
                }
            }
        }
    };

    const handleFileUpload = (payload: File | null) => {
        const file = payload;
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData: Hymn[] = JSON.parse(e.target?.result as string);
                validateJson(jsonData);
                handleLoadedData(jsonData, file?.name || "hymnal.json");
            } catch (error) {
                setError(error as string);
            }
        };

        if (file) {
            reader.readAsText(file);
        }
    };

    const handleFetchData = async (url: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error fetching data.");
            }
            const jsonData: Hymn[] = await response.json();
            validateJson(jsonData);
            handleLoadedData(
                jsonData,
                getFilenameFromResponse(response, "hymnal.json")
            );
        } catch (error) {
            console.error("Error fetching JSON data:", error);
            setError(error as string);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container size="md" className={classes.container}>
            <div>
                <FileButton onChange={handleFileUpload} accept=".json">
                    {(props) => <Button {...props}>Upload JSON File</Button>}
                </FileButton>
                <Space h="md" />
                <Text>OR</Text>
                <Space h="md" />
                <Grid>
                    <Grid.Col span={8}>
                        <Input
                            placeholder="Enter JSON URL"
                            value={url}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setUrl(event?.target.value)
                            }
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Button
                            variant="outline"
                            onClick={() => handleFetchData(url)}
                            loading={isLoading}
                            disabled={!url}
                        >
                            Fetch Data
                        </Button>
                    </Grid.Col>
                </Grid>
                <Space h="md" />
                {url && <Code>{url}</Code>}
                <Space h="md" />
                <Text>
                    Upload or type url to a hymnal json file to get started. The
                    content of the json should be an array of objects with a
                    title,content and number property like the example shown
                    below or you can check examples of other files here{" "}
                    <a href="https://github.com/TinasheMzondiwa/cis-hymnals">
                        https://github.com/TinasheMzondiwa/cis-hymnals
                    </a>
                </Text>
                <Space h="md" />
                <pre>{`
{
    "title": "3 Face To Face",
    "number": 3,
    "content": "<h1>some html here, content can also in markdown</h1>"
}`}</pre>
                <Space h="md" />
                <Text>
                    We also support the markdown format, so you can have:
                </Text>
                <Space h="md" />
                <pre>{`
{
    "title": "3 Face To Face",
    "number": 3,
    "markdown": "## Some markdown here",
}`}</pre>
                <Space h="md" />
                <Text color="red">
                    {error &&
                        `${error}, make sure the file is JSON and the content of the file matches the format above`}
                </Text>
            </div>
        </Container>
    );
};

export default FileUploadArea;
