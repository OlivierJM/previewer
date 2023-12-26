import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

type ColorSchemeContextType = {
    colorScheme: "dark" | "light";
    toggleColorScheme: () => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
    undefined
);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
    const [colorScheme, setColorScheme] = useState<"dark" | "light">(() => {
        const getInitialValue = () => {
            if (window.matchMedia) {
                return window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            } else {
                return "light";
            }
        };

        return getInitialValue();
    });

    const toggleColorScheme = () => {
        setColorScheme((prevScheme) =>
            prevScheme === "light" ? "dark" : "light"
        );
    };

    // Effect to update color scheme based on device preference changes
    useEffect(() => {
        const handleMediaChange = (event: MediaQueryListEvent) => {
            setColorScheme(event.matches ? "dark" : "light");
        };
        const mediaQueryList = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        mediaQueryList.addEventListener("change", handleMediaChange);
        return () => {
            mediaQueryList.removeEventListener("change", handleMediaChange);
        };
    }, []);

    const contextValue: ColorSchemeContextType = {
        colorScheme,
        toggleColorScheme,
    };

    return (
        <ColorSchemeContext.Provider value={contextValue}>
            {children}
        </ColorSchemeContext.Provider>
    );
}

export const useColorScheme = (): ColorSchemeContextType => {
    const context = useContext(ColorSchemeContext);
    if (!context) {
        throw new Error(
            "useColorScheme must be used within a ColorSchemeProvider"
        );
    }
    return context;
};
