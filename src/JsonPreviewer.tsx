import React, { useState } from 'react';
import {
  Grid,
  List,
  useMantineTheme,
  Container,
  Button,
  Drawer,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ItemProps } from './utils';
import HymnItem from './components/HymnItem';
import HymnPreview from './components/HymnPreview';
import FIleUploadArea from './components/FileUploadArea';

const MarkdownList: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<ItemProps[] | null>(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFileUpload = (payload: File | null) => {
    const file = payload;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData: ItemProps[] = JSON.parse(e.target?.result as string);
        setList(jsonData);
        validateJson(jsonData);
        setError(null);
      } catch (error) {
        setError(error as  string);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const validateJson = (jsonData: ItemProps[]) => {
    if (!Array.isArray(jsonData)) {
      throw new Error(
        'Invalid JSON format. contents of this JSON file must be an array.'
      );
    }

    for (const item of jsonData) {
      if (item.title || item.content || item.number) {
        if (
          typeof item.title !== 'string' ||
          typeof item.content !== 'string'
        ) {
          throw new Error(
            'Invalid JSON format. "title" and "content" properties must be strings.'
          );
        }
      }
    }
  };

  const handleItemClick = (content: string) => {
    setSelectedItem(content);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };


  if (error || !list) {
    return <FIleUploadArea handleFileUpload={handleFileUpload} error={error} />;
  }

  return (
    <>
      <Container size={isMobile ? "sm" : "xl"}>
        {isMobile && (
          <Button
            variant="outline"
            onClick={handleOpenDrawer}
            style={{ marginBottom: theme.spacing.sm }}
          >
            Open Drawer
          </Button>
        )}

        {!isMobile && (
          <Grid>
            <Grid.Col span={4}>
              <List listStyleType="none" withPadding>
                {list?.map((item) => (
                  <HymnItem
                    key={item.number}
                    item={item}
                    selectedItem={selectedItem}
                    handleItemClick={handleItemClick}
                  />
                ))}
              </List>
            </Grid.Col>
            <Grid.Col span={8}>
              <HymnPreview selectedItem={selectedItem} />
            </Grid.Col>
          </Grid>
        )}

        {isMobile && (
          <>
            <HymnPreview selectedItem={selectedItem} />
            <Drawer
              opened={isDrawerOpen}
              onClose={handleCloseDrawer}
              size="md"
              padding="md"
              title="List of Hymns"
              withCloseButton={false}
            >
              <List listStyleType="none" withPadding>
                {list?.map((item) => (
                  <HymnItem
                    key={item.number}
                    item={item}
                    selectedItem={selectedItem}
                    handleItemClick={handleItemClick}
                  />
                ))}
              </List>
            </Drawer>
          </>
        )}
      </Container>
    </>
  );
};

export default MarkdownList;
