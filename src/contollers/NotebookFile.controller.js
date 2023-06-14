import NotebookFile from "../models/NotebookFile.model";

export const createNotebookFile = async (req, res, next) => {
  try {
    let folderExistObj = await NotebookFile.findOne({ name: req.body.name, userId: req.user.userId }).lean().exec();
    if (folderExistObj) throw new Error("Folder Already Exists");

    await new NotebookFile(req.body).save();

    res.status(200).json({ message: "Folder Created Successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const getFileByNotebookId = async (req, res, next) => {
  try {
    let foldersArr = await NotebookFile.find({ notebookFolderId: req.query.notebookFolderId }).sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ message: "Folders", data: foldersArr, success: true });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    let obj = await NotebookFile.findById(req.params.id).lean().exec();
    res.status(200).json({ message: "obj", data: obj, success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    await NotebookFile.findByIdAndRemove(req.params.id).exec();
    res.status(200).json({ message: "Notebook Folder Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
export const updateById = async (req, res, next) => {
  try {
    await NotebookFile.findByIdAndUpdate(req.params.id, { name: req.body.name, message: req.body.message }).exec();
    res.status(200).json({ message: "Notebook Folder Name Changed", success: true });
  } catch (error) {
    next(error);
  }
};
