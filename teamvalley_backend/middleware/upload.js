const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createFolderIfMissing = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads";

    if (file.fieldname === "logo") {
      uploadPath = "uploads/logos";
    }

    if (file.fieldname === "cv") {
      uploadPath = "uploads/cvs";
    }

    createFolderIfMissing(uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${fileExtension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "logo") {
    const allowedLogoTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedLogoTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG or WEBP images are allowed for logo."));
    }
  }

  if (file.fieldname === "cv") {
    const allowedCvTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedCvTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF, DOC or DOCX files are allowed for CV."));
    }
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;