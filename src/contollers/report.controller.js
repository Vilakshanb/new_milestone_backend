import { INFO_TYPE, ROLES } from '../helpers/constant';
import Client from '../models/clients.model';
import GeneralInfo from '../models/generalInfo.model';
import GiPolicy from '../models/GiPolicy.model';
import UserAnswers from '../models/userAnswers.model'
import Users from '../models/user.model'

export const clientBasicInformationGet = async (req, res, next) => {
    try {
        let arr = await Client.find().lean().exec();
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}


export const getBirthDays = async (req, res, next) => {
    try {
        let arr = await Client.find().lean().exec();
        arr = arr.map(el => ({ name: el.fullName, phone: el.mobileNo, email: el.emailId, gender: el.gender, dob: el.dob }))
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}



export const getAllInsuranceBranch = async (req, res, next) => {
    try {
        let arr = await GeneralInfo.find({ infoType: INFO_TYPE.INSURANCE_BRANCH }).lean().exec();
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}

export const getAddonMasters = async (req, res, next) => {
    try {
        let arr = []
        let policyArr = await GiPolicy.find().lean().exec();
        for (let el of policyArr) {
            arr = [...arr, el?.addOnDetailsArr]
        }
        arr = arr.flatMap(el => el)
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}


export const getUserRiskTypeAnswers = async (req, res, next) => {
    try {
        let arr = await UserAnswers.find().lean().exec();
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}

export const hpaMaster = async (req, res, next) => {
    try {
        let hpaArr = [];
        let policyArr = await GiPolicy.find().lean().exec();
        for (let i = 0; i < policyArr.length; i++) {
            if (policyArr[i].hpaName != "") {
                hpaArr.push({ hpaName: policyArr[i].hpaName, hpaBranch: policyArr[i].hpaBranch, policyId: policyArr[i]?._id, name: policyArr[i].insurerName, headBy: policyArr[i].headBy, groupHeadName: policyArr[i].groupHeadName, })
            }
        }
        console.log(hpaArr)
        res.status(200).json({ message: 'hpa Master', data: hpaArr, success: true });
    } catch (error) {
        next(error)
    }
}

export const makeMaster = async (req, res, next) => {
    try {
        let makeArr = [];
        let policyArr = await GiPolicy.find().lean().exec();
        for (let i = 0; i < policyArr.length; i++) {
            if (policyArr[i].make != "") {
                makeArr.push({ make: policyArr[i].make, policyId: policyArr[i]?._id, name: policyArr[i].insurerName, headBy: policyArr[i].headBy, groupHeadName: policyArr[i].groupHeadName, })
            }
        }
        res.status(200).json({ message: 'hpa Master', data: makeArr, success: true });
    } catch (error) {
        next(error)
    }
}

export const modelMaster = async (req, res, next) => {
    try {
        let modelArr = [];
        let policyArr = await GiPolicy.find().lean().exec();
        for (let i = 0; i < policyArr.length; i++) {
            if (policyArr[i].model != "") {
                modelArr.push({ model: policyArr[i].model, policyId: policyArr[i]?._id, name: policyArr[i].insurerName, headBy: policyArr[i].headBy, groupHeadName: policyArr[i].groupHeadName, })
            }
        }
        res.status(200).json({ message: 'hpa Master', data: modelArr, success: true });
    } catch (error) {
        next(error)
    }
}


export const policyPurchased = async (req, res, next) => {
    try {
        let aggregation = [
            {
                '$project': {
                    '_id': 1,
                    'headBy': 1,
                    'status': 1,
                    'insurerName': 1,
                    'groupHeadName': 1,
                    'mobile': 1,
                    'policyNumber': 1,
                    'createdAt': 1,
                    'periodFrom': 1,
                    'periodTo': 1
                }
            }
        ]
        let arr = await GiPolicy.aggregate(aggregation);
        res.status(200).json({ message: 'Arr', data: arr, success: true });

    } catch (error) {
        next(error)
    }
}

export const OdTpPremiumReport = async (req, res, next) => {
    try {
        let aggregation = [
            {
                '$project': {
                    '_id': 1,
                    'headBy': 1,
                    'status': 1,
                    'insurerName': 1,
                    'groupHeadName': 1,
                    'companyName': 1,
                    'mobile': 1,
                    'policyNumber': 1,
                    'createdAt': 1,
                    'periodFrom': 1,
                    'periodTo': 1,
                    'OdPremium': 1,
                    'tpPremium': 1,
                    'cashAmount': 1,
                    'totalAmount': 1,
                    'discount': 1,
                    'netPremiumAmount': 1,
                    'terrorismPremium': 1,
                    'gst': 1,
                    'Type': 1,
                    'insuranceType': 1,
                    'insuranceSubType': 1,
                    'productName': 1
                }
            }
        ]
        let arr = await GiPolicy.aggregate(aggregation);
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}


export const BaReport = async (req, res, next) => {
    try {
        let aggregation = [
            {
                '$project': {
                    '_id': 1,
                    'headBy': 1,
                    'status': 1,
                    'insurerName': 1,
                    'groupHeadName': 1,
                    'companyName': 1,
                    'BaName': 1,
                    'SmName': 1,
                    'mobile': 1,
                    'policyNumber': 1,
                    'createdAt': 1,


                }
            }
        ]
        let arr = await GiPolicy.aggregate(aggregation);
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}

export const policyDownload = async (req, res, next) => {
    try {
        let aggregation = [
            {
                '$project': {
                    '_id': 1,
                    'headBy': 1,
                    'status': 1,
                    'insurerName': 1,
                    'groupHeadName': 1,
                    'companyName': 1,
                    'BaName': 1,
                    'SmName': 1,
                    'mobile': 1,
                    'policyNumber': 1,
                    'createdAt': 1,
                    'proposalFile': 1,
                    'policyFile': 1
                }
            }
        ]
        let arr = await GiPolicy.aggregate(aggregation);
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(error)
    }
}

export const getAgentDataList = async (req, res, next) => {
    try {
        let arr = await Users.find({ role: ROLES.SUBBROKER }).lean().exec();
        arr = arr.map(el => ({ name: el.name, phone: el.phone, email: el.email, role: el.role }))
        res.status(200).json({ message: 'Arr', data: arr, success: true });
    } catch (error) {
        next(Error)
    }
}

