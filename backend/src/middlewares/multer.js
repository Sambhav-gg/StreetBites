import multer from "multer";

const storage = multer.memoryStorage(); // We use memory storage to directly send buffer to S3
const upload = multer({ storage });

export default upload;
