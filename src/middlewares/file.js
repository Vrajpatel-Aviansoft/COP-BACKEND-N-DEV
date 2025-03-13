const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    "image/jpeg": true,
    "image/png": true,
    "image/gif": true,
    "image/svg+xml": true,
    "text/csv": true,
    "application/vnd.ms-excel": true,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true,
    "application/pdf": true,
    "application/msword": true,
    "video/mp4": true,
    "video/x-m4v": true,
    "video/*": true,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed types: JPG, PNG, GIF, PDF, DOC, DOCX, SVG, MP4"
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 5MB file size limit
    files: 100, // Maximum 100 files per upload
  },
});

module.exports = upload;
