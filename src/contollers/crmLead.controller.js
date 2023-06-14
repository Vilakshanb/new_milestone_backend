import CrmLead from "../models/crmLead.model";
import CrmLeadTimelineModel from "../models/CrmLeadTimeline.model";
import Users from "../models/user.model";
import { getRandomInt } from "../utils/idGenerator.utils";

export const createLead = async (req, res, next) => {
  try {
    let userObj = await Users.findById(req.user.userId).lean().exec();
    if (!userObj) throw new Error("User Not Found");
    let return_id = "";
    let createNewRecord = true;

    if (req.body._id) {
      console.log(req.body);
      let crmLeadObj = await CrmLead.findById(req.body._id).exec();

      if (req.body.notes != crmLeadObj?.notes) {
        let timelineObj = {
          changeStr: req.body.notes,
          changedById: req.user.userId,
          changedByName: userObj?.name,
          fieldUpdated: "Notes",
          leadId: crmLeadObj?._id,
        };

        await new CrmLeadTimelineModel(timelineObj).save();
      }
      let onBoardingUser = await CrmLead.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      req.body.displayLeadId = `LEAD-${getRandomInt(0, 9999999)}`;
      let obj = await new CrmLead(req.body).save();
      return_id = obj._id;
    }

    res.status(200).json({ message: "Client Updated", data: return_id, success: true });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req, res, next) => {
  try {
    let findObj = {};
    if (req.user.subscription?.orgId) {
      findObj = {
        orgId: req.user.subscription?.orgId,
      };
    }
    const clients = await CrmLead.find(findObj).sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ message: "Clients", data: clients, success: true });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    let obj = await CrmLead.findById(req.params.id).lean().exec();
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

    let onBoardingUser = await CrmLead.findByIdAndUpdate(req.params.id, { [req.body.keyName]: req.file.filename }).exec();
    if (!onBoardingUser) {
      throw new Error("User not found");
    }
    res.json({ message: "File Uploaded" });
  } catch (error) {
    next(error);
  }
};

export const deleteLeadById = async (req, res, next) => {
  try {
    await CrmLead.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: "Lead Deleted", success: true });
  } catch (error) {
    next(error);
  }
};

export const updateLeadFollowUp = async (req, res, next) => {
  try {
    let userObj = await Users.findById(req.user.userId).lean().exec();
    if (!userObj) throw new Error("User Not Found");
    let obj = {
      ...req.body,
    };
    console.log(req.body);
    let leadObj = await CrmLead.findById(req.params.id).lean().exec();
    if (!leadObj) throw new Error("Lead Not Found");
    let isFollowUpStageUpdated = false;
    if (leadObj?.followupstage != req.body.followupstage) {
      isFollowUpStageUpdated = true;
    }

    await CrmLead.findByIdAndUpdate(req.params.id, { $push: { followUpArr: obj }, status: req.body.status, notes: req.body.followUpNotes, followupstage: req.body.followupstage, followupDate: req.body.followupDate }).exec();

    let timelineObj = {
      changeStr: req.body.followUpNotes,
      changedById: req.user.userId,
      changedByName: userObj?.name,
      fieldUpdated: "Notes",
      leadId: req.params.id,
    };

    await new CrmLeadTimelineModel(timelineObj).save();
    if (isFollowUpStageUpdated) {
      let newtimelineObj = {
        changeStr: req.body.followupstage,
        changedById: req.user.userId,
        changedByName: userObj?.name,
        fieldUpdated: "Follow Up Stage",
        leadId: req.params.id,
      };

      await new CrmLeadTimelineModel(newtimelineObj).save();
    }
    res.status(200).json({ message: "Success", success: true });
  } catch (error) {
    next(error);
  }
};

export const getTimeLines = async (req, res, next) => {
  try {
    let arr = await CrmLeadTimelineModel.find({ leadId: req.params.id }).lean().exec();
    res.status(200).json({ message: "Arr", data: arr, success: true });
  } catch (error) {
    next(error);
  }
};

export const followUpArrElRemove = async (req, res, next) => {
  try {
    let crmleadObj = await CrmLead.findById(req.params.id).lean().exec();
    if (!crmleadObj) throw new Error("Lead Not Found");

    let tempArr = [...crmleadObj.followUpArr];
    tempArr = tempArr.filter((el) => el._id != req.body.id);

    await CrmLead.findByIdAndUpdate(req.params.id, { followUpArr: tempArr }).exec();
    res.status(200).json({ message: "Success", success: true });
  } catch (error) {
    next(error);
  }
};

export const followUpArrElUpdate = async (req, res, next) => {
  try {
    let crmleadObj = await CrmLead.findById(req.params.id).lean().exec();
    if (!crmleadObj) throw new Error("Lead Not Found");

    let userObj = await Users.findById(req.user.userId).lean().exec();
    if (!userObj) throw new Error("User Not Found");
    // let tempArr = [...crmleadObj.followUpArr];
    // tempArr = tempArr.filter((el) => el._id != req.body.id);

    await CrmLead.findOneAndUpdate({ _id: req.params.id, "followUpArr._id": req.body._id }, { $set: { "followUpArr.$.followUpNotes": req.body.notes } }).exec();
    let newtimelineObj = {
      changeStr: req.body.notes,
      changedById: req.user.userId,
      changedByName: userObj?.name,
      fieldUpdated: "Notes",
      leadId: req.params.id,
    };

    await new CrmLeadTimelineModel(newtimelineObj).save();
    res.status(200).json({ message: "Success", success: true });
  } catch (error) {
    next(error);
  }
};
