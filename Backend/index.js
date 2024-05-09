const express = require('express');
const multer = require('multer');
const docxToPDF = require("docx-pdf");
const path = require("path");

const app = express();
const port = 3000;

// Storage Create
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("hello world")
})

// Route handler after upload initialization
app.post("/convertFile", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    // Define output path
    let outputPath = path.join(__dirname, "files", `${req.file.originalname}.pdf`);
    docxToPDF(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error converting Docx to Pdf"
        });
      }
      res.download(outputPath, () => {
        console.log("File downloaded");
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});