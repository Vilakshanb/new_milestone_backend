import GeneralInfo from "../models/generalInfo.model";
export const createGeneralInfo = async (req, res, next) => {
  try {
    let return_id = "";
    let createNewRecord = true;

    if (req.body._id) {
      let onBoardingUser = await GeneralInfo.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      let obj = await new GeneralInfo(req.body).save();
      return_id = obj._id;
    }

    res.status(200).json({ message: "General Info Updated", data: return_id, success: true });
  } catch (error) {
    next(error);
  }
};

export const getGeneralInfo = async (req, res, next) => {
  try {
    let findObj = {};
    if (req.user.subscription?.orgId) {
      findObj = {
        orgId: req.user.subscription?.orgId,
      };
    }
    const clients = await GeneralInfo.find(findObj).lean().exec();
    res.status(200).json({ message: "Clients", data: clients, success: true });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    let obj = await GeneralInfo.findById(req.params.id).lean().exec();
    res.status(200).json({ message: "obj", data: obj, success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteGeneralInfo = async (req, res, next) => {
  try {
    await GeneralInfo.findByIdAndDelete(req.params.id).lean().exec();
    res.status(200).json({ message: "General Info Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
