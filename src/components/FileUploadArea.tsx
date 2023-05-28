import { Text, Button, Container, FileButton, Code } from '@mantine/core';

const FileUploadArea = ({ handleFileUpload, error }: { handleFileUpload: (payload: File | null) => void, error: string | null }) => {
  return (
    <Container size="md" style={{ height: '100vh' }}>
      <div
        style={{
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <FileButton  onChange={handleFileUpload} accept=".json">
          {(props) => <Button {...props}>Upload JSON File</Button>}
        </FileButton>
        <br />
        <Text align="center" >
         Upload a hymnal json file to get started.
         The content of the json should be an array of objects with a title and content property like the following:
        </Text>
        <br />
        <Code>
          {`{
            "title": "3 Face To Face",
            "number": 3,
            "content": "<h1>some html here</h1>"
          }`}
        </Code>

        <br />
        <Text align="center" color="red">
          {error &&`${error}, make sure the content of the file matches the above format`}
        </Text>
      </div>
    </Container>
  );
};

export default FileUploadArea;


