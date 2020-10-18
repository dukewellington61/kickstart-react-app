import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xC3f00f5Ba4DE3Ca5708738b73aD908Cead638559"
);

export default instance;
