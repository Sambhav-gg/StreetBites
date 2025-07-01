import express from 'express';
import multer from 'multer';
import  s3  from '../lib/aws.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Use multer to handle file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const fileKey = `profile-images/${uuidv4()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read', // File will be publicly accessible
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    res.status(200).json({ imageUrl: uploadResult.Location });
  } catch (error) {
    console.error('S3 upload error:', error);
    res.status(500).json({ message: 'Failed to upload to S3' });
  }
});

export default router;
