import Todo from "../models/Todo.model";

export const createToDo = async (req, res, next) => {
  try {
    let return_id = "";
    let createNewRecord = true;

    if (req.body._id) {
      console.log(req.body);
      let onBoardingUser = await Todo.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      let obj = await new Todo(req.body).save();
      return_id = obj._id;
    }

    res.status(200).json({ message: "Todo Updated", data: return_id, success: true });
  } catch (error) {
    next(error);
  }
};

export const getTodoByUserId = async (req, res, next) => {
  try {
    const clients = await Todo.find({ userId: req.query.userId }).sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ message: "Clients", data: clients, success: true });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    let obj = await Todo.findById(req.params.id).lean().exec();
    res.status(200).json({ message: "obj", data: obj, success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    await Todo.findByIdAndRemove(req.params.id).exec();
    res.status(200).json({ message: "Todo Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
