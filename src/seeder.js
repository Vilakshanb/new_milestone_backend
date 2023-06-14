import { encryptPassword } from "./helpers/bcrypt";
import { ROLES } from "./helpers/constant";
import riskScoreRelationshipModel from "./models/riskScoreRelationship.model";
import userModel from "./models/user.model";

const seedData = () => {
  seedAdmin();
  seedRisk();
};

export const seedAdmin = async () => {
  try {
    let numberOfAdmins = await userModel.countDocuments({ role: ROLES.ADMIN }).exec();
    if (numberOfAdmins == 0) {
      let password = await encryptPassword("admin@1234");
      await new userModel({
        name: "Admin",
        email: "admin@admin.com",
        password: password,
        phone: "1234567890",
        role: ROLES.ADMIN,
      }).save();
    }
  } catch (error) {
    console.error("seedAdmin Error =>", error);
  }
};

export const seedRisk = async (orgId = "") => {
  try {
    let findObj = {};
    if (orgId) {
      findObj.orgId = orgId;
    } else {
      findObj.orgId = { $exists: false };
    }
    let numberOfRisks = await riskScoreRelationshipModel.countDocuments(findObj).exec();
    if (numberOfRisks == 0) {
      if (orgId) {
        await new riskScoreRelationshipModel({
          orgId,
          riskArray: [
            {
              endPercentage: 100,
              risk: "",
            },
          ],
        }).save();
      } else {
        await new riskScoreRelationshipModel({
          riskArray: [
            {
              endPercentage: 100,
              risk: "",
            },
          ],
        }).save();
      }
    }
  } catch (error) {
    console.error("seedRisk Error =>", error);
  }
};
export default seedData;
