import React from 'react';
import { Edit, SimpleForm, TextInput, FileField, FileInput} from 'react-admin';
const NotesEdit = (props) => {
    return (
        <Edit {...props}>
          <SimpleForm>
                <FileInput source="file" required>
                    <FileField source="src" title="title"/>
                </FileInput>
            </SimpleForm>
        </Edit>
      );
    };

export default NotesEdit;