const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');

const DB_URI = process.env.DB_URL || "mongodb://localhost:27017/mongouploads";

mongoose.set('useNewUrlParser', true);
const conn = mongoose.createConnection(DB_URI);

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: DB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({storage});


// @route GET /
// @desc Loads form
async function index(req, res, next) {
  try {
    gfs.files.find().toArray((err, files) => {
      if (!files || files.length === 0) {
        res.render('home', {files: false});
      } else {
        files.map(file => {
          file.isImage = file.contentType === 'image/jpeg' || file.contentType === 'image/png';
        });
        return res.status(200).type('html').render('home', {files: files});
      }
    });

  } catch (error) {
    next(error);
  }
}

// @route POST /upload
// @desc  Uploads file to DB
async function store(req, res, next) {
  try {
    upload.single('file');
    res.redirect('/home');
  } catch (error) {
    next(error);
  }
}

// @route GET /files
// @desc  Display all files in JSON
async function get_files(req, res, next) {
  try {
    gfs.files.find().toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
      return res.json(files);
    });
  } catch (error) {
    next(error);
  }
}


// @route GET /files/:filename
// @desc  Display single file object
async function get_file(req, res, next) {
  try {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      return res.json(file);
    });
  } catch (error) {
    next(error);
  }
}


// @route GET /image/:filename
// @desc Display Image
async function get_image(req, res, next) {
  try {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {

      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  } catch (error) {
    next(error);
  }
}

// @route DELETE /files/:id
// @desc  Delete file
async function delete_file(req, res, next) {
  try {
    gfs.remove({_id: req.params.id, root: 'uploads'}, (err) => {
      if (err) return res.status(404).json({err: err});
      res.redirect('/home');
    });
  } catch (error) {
    next(error);
  }
}


module.exports.index = index;
module.exports.store = store;
module.exports.get_files = get_files;
module.exports.get_file = get_file;
module.exports.get_image = get_image;
module.exports.delete_file = delete_file;
