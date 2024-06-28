const db = require("../models");
const File = db.file;
const fs = require('fs');
const path = require('path');

exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).send({ message: "Please upload a file" });

    File.create({
        name: req.file.originalname,
        extension: path.extname(req.file.originalname),
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date()
    })
        .then(file => {
            res.status(200).send({ message: "File uploaded successfully!", file });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getFileList = (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const listSize = req.query.list_size ? parseInt(req.query.list_size) : 10;
    const offset = (page - 1) * listSize;

    File.findAndCountAll({
        limit: listSize,
        offset: offset
    })
        .then(result => {
            res.status(200).send({
                totalItems: result.count,
                totalPages: Math.ceil(result.count / listSize),
                currentPage: page,
                files: result.rows
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
};

exports.getFileById = (req, res) => {
    File.findByPk(req.params.id)
        .then(file => {
            if (!file) return res.status(404).send({ message: "File not found" });
            res.status(200).send(file)
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.downloadFile = (req, res) => {
    File.findByPk(req.params.id)
        .then(file => {
            if (!file) return res.status(404).send({ message: "File not found" });
            res.download(path.join(__dirname, "../uploads", file.name));
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
}

exports.updateFile = (req, res) => {
    if (!req.file) return res.status(400).send({ message: "Please upload a file" });

    File.findByPk(req.params.id)
        .then(file => {
            if (!file) return res.status(404).send({ message: "File not found" });

            fs.unlinkSync(path.join(__dirname, "../uploads", file.name));

            file.name = req.file.originalname;
            file.extension = path.extname(req.file.originalname);
            file.mimeType = req.file.mimeType;
            file.size = req.file.size;
            file.uploadDate = new Date();

            file.save()
                .then(updatedFile => {
                    res.status(200).send({ message: "File updated successfully", updatedFile });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
}

exports.deleteFile = (req, res) => {
    File.findByPk(req.params.id)
        .then(file => {
            if (!file) return res.status(404).send({ message: "File not found" });

            fs.unlinkSync(path.join(__dirname, "../uploads", file.name));

            file.destroy()
                .then(() => {
                    res.status(200).send({ message: "File deleted successfully" });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
}