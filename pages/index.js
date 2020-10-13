import React, { Component } from "react";
import factory from "../ethereum/factory";

class CampaignIndex extends Component {
  // the static keyword is a requirement by next.js --> it means that function is not assigned to instance of CampaignIndex class but to CampaignIndex class itself
  // next wants to be able to retrieve that data without rendering the component because rendering a component is very expensive
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  render() {
    return <div>{this.props.campaigns[0]}</div>;
  }
}

export default CampaignIndex;
