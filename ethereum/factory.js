import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x58389eBD19dFE4b03Bb38129f487e4791892D9f0"
);

export default instance;
