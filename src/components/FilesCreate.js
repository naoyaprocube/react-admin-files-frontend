import React from 'react';
import { Create, SimpleForm, TextInput, FileField, FileInput} from 'react-admin';
const FilesCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <FileInput source="file" required>
            <FileField source="src" title="title"/>
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default FilesCreate;
