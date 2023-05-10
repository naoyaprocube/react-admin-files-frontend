import React from 'react';
import { Admin, Resource } from 'react-admin';
import myDataProvider from './dataProvider';
import FilesList from './components/FilesList';
import FilesEdit from './components/FilesEdit';
import FilesCreate from './components/FilesCreate';

function App() {
  return (
    <Admin dataProvider={myDataProvider}>
      <Resource
        name="files"
        list={FilesList}
        edit={FilesEdit}
        create={FilesCreate}
      />
    </Admin>
  );
}

export default App;
