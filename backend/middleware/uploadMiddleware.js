import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error: File type not supported!");
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
});
