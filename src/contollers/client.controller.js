import Client from "../models/clients.model";

export const createClient = async (req, res, next) => {
  try {
    let return_id = "";
    let createNewRecord = true;

    // if (req?.user?.userObj?.orgId != "") {
    //   req.body.orgId = req?.user?.userObj?.orgId;
    // }
    if (req.body._id) {
      console.log(req.body);
      let onBoardingUser = await Client.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      let existCheck = await Client.findOne({ mobileNo: req.body.mobileNo }).lean().exec();
      if (existCheck) throw new Error("Client Already Exists");
      let obj = await new Client(req.body).save();
      return_id = obj._id;
    }

    res.status(200).json({ message: "Client Information Saved Successfully", data: return_id, success: true });
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req, res, next) => {
  try {
    let clientsArr = [];
    if (req?.user?.userObj?.orgId != "") clientsArr = await Client.find({ orgId: req?.user?.userObj?.orgId }).sort({ createdAt: -1 }).lean().exec();
    else {
      clientsArr = await Client.find().sort({ createdAt: -1 }).lean().exec();
    }
    res.status(200).json({ message: "Clients", data: clientsArr, success: true });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    let obj = await Client.findById(req.params.id).lean().exec();
    res.status(200).json({ message: "obj", data: obj, success: true });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    let onBoardingUser = await Client.findByIdAndUpdate(req.params.id, { [req.body.keyName]: req.file.filename }).exec();
    if (!onBoardingUser) {
      throw new Error("User not found");
    }
    res.json({ message: "File Uploaded" });
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    await Client.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: "Client Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
