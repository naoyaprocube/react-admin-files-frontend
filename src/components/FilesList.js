import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  FileField,
} from 'react-admin';

const FilesList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <FileField source="file.src" title="file.title" label="File" download/>
        {/* <EditButton label="Edit" basePath="/files" /> */}
        <DeleteButton label="Delete" basePath="/files" />
      </Datagrid>
    </List>
  );
};

export default FilesList;