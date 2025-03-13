const minio = require('minio');
const { minio: minioConfig } = require('./config');

const minioClient = new minio.Client({
  endPoint: minioConfig.endPoint,
  accessKey: minioConfig.accessKey,
  port: 9000,
  secretKey: minioConfig.secretKey,
  useSSL: false,
});

const putObject = async (path, fileBuffer, contentType) => {
  try {
    await minioClient.putObject(
      minioConfig.bucket,
      path,
      fileBuffer,
      contentType
    );
  } catch (error) {
    throw error;
  }
};

const moveObject = async (sourceFolder, destinationFolder) => {
  try {
    const stream = minioClient.listObjects(
      minioConfig.bucket,
      sourceFolder,
      true
    );
    for await (const obj of stream) {
      const newPath = obj.name.replace(sourceFolder, destinationFolder);
      await minioClient.copyObject(
        minioConfig.bucket,
        newPath,
        `/${minioConfig.bucket}/${obj.name}`
      );
      await minioClient.removeObject(minioConfig.bucket, obj.name);
    }
  } catch (error) {
    console.error('Error moving files:', error);
  }
};

const deleteObjects = async (sourceFolder, prefix) => {
  const stream = minioClient.listObjects(
    minioConfig.bucket,
    sourceFolder + '/' + prefix,
    true
  );
  const paths = [];
  for await (const obj of stream) {
    paths.push(obj.name);
  }
  await minioClient.removeObjects(minioConfig.bucket, paths);
};

module.exports = {
  putObject,
  moveObject,
  deleteObjects,
};
