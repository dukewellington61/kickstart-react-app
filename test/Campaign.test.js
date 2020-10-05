const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

// this is mainly to test a campaign and to a lesser degree to test the factory
// almost every test needs an instance of a campaign
// rather than using the factory inside of an it statement to create a seperate instance of the campaign
// we make one campaing inside the before each
let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // the factory contract is beeing deployed to the local test blockchain ganache
  // constructor called Contract gets passed in an instance of the abi (interface) of
  // the compiled contract CampaignFactory
  // this creates said contract in web3 (so to speak) which is then actually deployed
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  // a new campaing is beeing created using the contract factory
  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  // targets the first element in the array that is beeing returned by getDeployedCampaigns() and sets it to campaignAddress
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // instructs web3 to create a javascript representation of the instance of the Campaign contract which is beeing instantiated using the factory contract
  // which has been deployed to the blockchain with the address campaignAddress
  // than we can then interact with said javascript representation
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaign", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaing manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  // tests if contributers are beeing entered in the approvers mapping
  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    // we have marked the mapping 'approvers' as public, thatswhy solidity has created a getter
    // which takes an address as an argument and returns true if this address is in the mapping
    const isContributer = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributer);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "99",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("fails if a minimum contribution isn't met", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "99",
        from: accounts[1],
      });
      assert(true);
    } catch (err) {
      assert(false);
    }
  });
});
