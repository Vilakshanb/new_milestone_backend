import NotebookFolder from "../models/NotebookFolder.model";
import NotebookFile from "../models/NotebookFile.model";

export const createNotebookFolder = async (req, res, next) => {
  try {
    let folderExistObj = await NotebookFolder.findOne({ name: req.body.name, userId: req.user.userId }).lean().exec();
    if (folderExistObj) throw new Error("Folder Already Exists");

    await new NotebookFolder(req.body).save();

    res.status(200).json({ message: "Folder Created Successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const getFolderByUserId = async (req, res, next) => {
  try {
    let foldersArr = await NotebookFolder.find({ userId: req.query.userId }).sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ message: "Folders", data: foldersArr, success: true });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    let obj = await NotebookFolder.findById(req.params.id).lean().exec();
    res.status(200).json({ message: "obj", data: obj, success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    await NotebookFolder.findByIdAndRemove(req.params.id).exec();
    res.status(200).json({ message: "Notebook Folder Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
export const updateById = async (req, res, next) => {
  try {
    await NotebookFolder.findByIdAndUpdate(req.params.id, { name: req.body.name }).exec();
    res.status(200).json({ message: "Notebook Folder Name Changed", success: true });
  } catch (error) {
    next(error);
  }
};
