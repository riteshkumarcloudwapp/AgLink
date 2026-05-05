import multer from "multer";
import path from "path";
import fs from "fs";

//Dynamic storage factory
const createMulter = (folderName = "others") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = folderName || "others";
      const uploadPath = path.join("assets", folder);

      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  });

  return multer({ storage });
};

export default createMulter;
