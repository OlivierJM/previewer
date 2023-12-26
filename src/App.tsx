import { MantineProvider } from "@mantine/core";
import PreviewContainer from "./JsonPreviewer";
import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { ColorSchemeProvider, useColorScheme } from "./Context/ColorScheme";

function AppWithColorSchemeProvider() {
    return (
        <ColorSchemeProvider>
            <App />
        </ColorSchemeProvider>
    );
}

function App() {
    const { colorScheme } = useColorScheme();

    return (
        <MantineProvider forceColorScheme={colorScheme}>
            <PreviewContainer />
        </MantineProvider>
    );
}

export default AppWithColorSchemeProvider;
