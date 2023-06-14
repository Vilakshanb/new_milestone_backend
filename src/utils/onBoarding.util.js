import { CONFIG } from "../helpers/config";

export const generateRandomId = () => {
  return Math.floor(Math.random() * 9999999999);
};

export const getFilePath = (img) => {
  return "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmemetizando.com%2Fwp-content%2Fuploads%2F2020%2F09%2FAadhar-Card.jpg&f=1&nofb=1";
  //   return `${CONFIG.SERVER_URL}/uploads/${img}`;
};
