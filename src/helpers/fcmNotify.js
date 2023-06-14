import admin from "firebase-admin";
var serviceAccount = require("./milestone-b8db4-firebase-adminsdk-ce73g-f87d845cbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const fcmNotify = async (notificationData, regToken) => {
  //notificationData is an object with 2 parameters title and content
  if (regToken) {
    let payload, options;
    payload = {
      data: notificationData,
    };
    options = {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    };
    const val = await admin.messaging().sendToDevice(regToken, payload, options);
    console.log(val);
    return val;
  }
  return 0;
};

export const fcmMulticastNotify = async (notificationObj) => {
  //notificationData is an object with 2 parameters title and content
  if (notificationObj) {
    if (notificationObj.tokens.length) {
      notificationObj.android = { priority: "high" };
      const val = await admin.messaging().sendMulticast(notificationObj);
      console.log(val);
      return val;
    }
  }
  return 0;
};
