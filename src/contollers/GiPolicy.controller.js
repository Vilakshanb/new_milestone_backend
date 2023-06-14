import GiPolicy from "../models/GiPolicy.model";
import Client from "../models/clients.model";
export const createGiPolicy = async (req, res, next) => {
  try {
    let return_id = "";
    let createNewRecord = true;

    // if (req?.user?.userObj?.orgId != "") {
    //   req.body.orgId = req?.user?.userObj?.orgId;
    // }
    if (req.body._id) {
      console.log(req.body);
      let onBoardingUser = await GiPolicy.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      let existCheck = await Client.findOne({ mobileNo: req.body.mobile }).lean().exec();
      if (!existCheck) throw new Error("Client Not Found . Please Add New Client");
      req.body.investorId = existCheck?._id;
      req.body.insurerName = existCheck?.fullName;
      let obj = await new GiPolicy(req.body).save();
      return_id = obj._id;
    }

    res.status(200).json({ message: "Gi Policy Updated", data: return_id, success: true });
  } catch (error) {
    next(error);
  }
};

export const getGiPolicy = async (req, res, next) => {
  try {
    const clients = await GiPolicy.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ message: "Clients", data: clients, success: true });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    let obj = await GiPolicy.findById(req.params.id).lean().exec();
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

    let onBoardingUser = await GiPolicy.findByIdAndUpdate(req.params.id, { [req.body.keyName]: req.file.filename }).exec();
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
    await GiPolicy.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: "Policy Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
