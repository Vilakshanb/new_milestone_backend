let multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("filepath", process.cwd() + "/src/public/uploads/");
    cb(null, process.cwd() + "/src/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

export const upload = multer({ storage: storage });
