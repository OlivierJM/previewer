import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Grid,
  TypographyStylesProvider,
  List,
  Text,
  Paper,
  Center,
  useMantineTheme,
  Container,
} from '@mantine/core';

interface Item {
  title: string;
  content: string;
  number: number;
}

const MarkdownList: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<Item[] | null>(null);
  const theme = useMantineTheme();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData: Item[] = JSON.parse(e.target?.result as string);
        setList(jsonData);
        validateJson(jsonData);
        setError(null);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        setError('Invalid JSON file.');
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const validateJson = (jsonData: Item[]) => {
    if (!Array.isArray(jsonData)) {
      throw new Error(
        'Invalid JSON format. "items" property must be an array.'
      );
    }

    for (const item of jsonData) {
      if (typeof item.title !== 'string' || typeof item.content !== 'string') {
        throw new Error(
          'Invalid JSON format. "title" and "content" properties must be strings.'
        );
      }
    }
  };

  const handleItemClick = (content: string) => {
    setSelectedItem(content);
  };

  return (
    <>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <Container size="xl">
        <Grid>
          <Grid.Col span={4}>
            <ul>
              <List listStyleType="none" withPadding>
                {list?.map((item, index) => (
                  <List.Item
                    key={index}
                    onClick={() => handleItemClick(item.content)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor:
                        selectedItem === item.content
                          ? theme.colors.gray[0]
                          : 'transparent',
                      paddingLeft: theme.spacing.md,
                      paddingRight: theme.spacing.md,
                      paddingTop: theme.spacing.xs,
                      paddingBottom: theme.spacing.xs,
                      borderLeft: `3px solid ${theme.colors.blue[6]}`,
                      borderRadius: theme.radius.sm,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight:
                          selectedItem === item.content ? 'bold' : 'normal',
                      }}
                    >
                      {item.title}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </ul>
          </Grid.Col>
          <Grid.Col span={8}>
            <Center>
              {error && <p>{error}</p>}
              <TypographyStylesProvider>
                <div dangerouslySetInnerHTML={{ __html: selectedItem || '' }} />
              </TypographyStylesProvider>
              {/* {selectedItem && <ReactMarkdown>{selectedItem}</ReactMarkdown>} */}
            </Center>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default MarkdownList;
