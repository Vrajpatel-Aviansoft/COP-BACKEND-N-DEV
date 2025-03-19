const minio = require('minio');
const { minio: minioConfig } = require('./config');

const minioClient = new minio.Client({
  endPoint: minioConfig.endPoint,
  port: 443,
  useSSL: true,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey,
  s3ForcePathStyle: true, // may be required for Wasabi
  signatureVersion: 'v4'
});

const putObject = async (path, fileBuffer, contentType) => {
  try {
    await minioClient.putObject(
      minioConfig.bucket,
      path,
      fileBuffer,
      contentType
    );
    return await getPresignedReadURL(minioConfig.bucket, path, 86400 * 7);
  } catch (error) {
    throw error;
  }
};

/**
 * Generate a presigned URL for reading an object from Wasabi.
 * @param {string} bucket - Your bucket name.
 * @param {string} objectName - The object key.
 * @param {number} expiry - Time in seconds until expiration.
 * @returns {Promise<string>}
 */
async function getPresignedReadURL(bucket, objectName, expiry) {
  return new Promise(async (resolve, reject) => {
    await minioClient.presignedGetObject(bucket, objectName, expiry, (err, url) => {
      if (err) {
        return reject(err);
      }
      resolve(url);
    });
  });
}

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
