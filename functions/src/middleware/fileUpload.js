const os = require('os');
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');

const filesUpload = (req, res, next) => {
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  const fields = {};
  const files = [];
  const fileWrites = [];
  const tmpdir = path.resolve(__dirname, '../temp');

  busboy.on('field', (key, value) => {
    fields[key] = value;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const filepath = path.join(tmpdir, filename);
    console.log(
      `Handling file upload field ${fieldname}: ${filename} (${filepath})`,
    );
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    fileWrites.push(
      new Promise((resolve, reject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('finish', () => {
          fs.readFile(filepath, (err, buffer) => {
            const size = Buffer.byteLength(buffer);
            console.log(`${filename} is ${size} bytes`);
            if (err) {
              return reject(err);
            }

            files.push({
              fieldname,
              originalname: filename,
              filepath,
              encoding,
              mimetype,
              buffer,
              size,
            });
            return resolve();
          });
        });
        writeStream.on('error', reject);
      }),
    );
  });

  busboy.on('finish', () => {
    Promise.all(fileWrites)
      .then(() => {
        req.body = fields;
        req.files = files;
        next();
        return true;
      })
      .catch(next);
  });

  busboy.end(req.rawBody);
};

module.exports = filesUpload;
