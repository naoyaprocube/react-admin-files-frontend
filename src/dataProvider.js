import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'https://localhost:19444/fileserver/api';
const httpClient = fetchUtils.fetchJson;

const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource) => ({ ...resource, id: resource._id })),
      total: parseInt(headers.get('content-range').split('/').pop(), 10),
    }));
  },
  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: { ...json, id: json._id }, //!
    })),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json.map((resource) => ({ ...resource, id: resource._id })),
    }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource) => ({ ...resource, id: resource._id })),
      total: parseInt(headers.get('content-range').split('/').pop(), 10),
    }));
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ ...json, id: json._id })),

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json._id },
    })).then((x) => {
      console.log(x);
      return x
    }),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
      body: JSON.stringify(params.id),
    }).then(({ json }) => ({
      ...json,
      id: json._id,
    })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'DELETE',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },
};

const myDataProvider = {
  ...dataProvider,
  create: (resource, params) => {
    // if (resource !== 'posts') {
    //     // fallback to the default implementation
    //     return dataProvider.create(resource, params);
    // }

    /**
     * For posts update only, convert uploaded image in base 64 and attach it to
     * the `file` sent property, with `src` and `title` attributes.
     */
    
    // Freshly dropped files are File objects and must be converted to base64 strings
    const newFile = params.data.file
    console.log("resultin:" + convertFileToBase64(newFile))
    return convertFileToBase64(newFile)
        .then((x) => {
          console.log(x);
          return x
        })
        .then(base64File => ({
          src: base64File,
          title: `${params.data.file.title}`
        })
        )
        .then(transformedNewFile =>
            dataProvider.create(resource, {
                data: {
                    ...params.data,
                    file: {
                        ...transformedNewFile
                    },
                },
            })
        )
  }
}
/**
* Convert a `File` object returned by the upload input into a base 64 string.
* That's not the most optimized way to store images in production, but it's
* enough to illustrate the idea of data provider decoration.
*/
const convertFileToBase64 = file =>
  new Promise((resolve, reject) => {
      console.log("rawfile:" + file.rawFile)
      console.log("file?:" + (file.rawFile instanceof File))
      console.log("blob?:" + (file.rawFile instanceof Blob))
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file.rawFile);
      console.log("result:"+reader.result)
      return reader.result
  });

export default myDataProvider;
