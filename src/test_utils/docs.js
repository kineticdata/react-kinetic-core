import fs from 'fs';

export const fetchDocMarkdown = () => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/../../docs/README.md`, (error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data.toString().split('\n'));
    });
  });

  return promise;
};
