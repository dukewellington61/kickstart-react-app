import React, { Component } from "react";
import { Button, Form, Input } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
  };

  onSubmit = async (e) => {
    e.preventDefault();

    await ethereum.enable();

    const accounts = await web3.eth.getAccounts();

    await factory.methods
      .createCampaign(this.state.minimumContribution)
      .send({ from: accounts[0] });
  };

  render() {
    return (
      <Layout>
        <h1>Create a Campaign!</h1>

        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(e) =>
                this.setState({ minimumContribution: e.target.value })
              }
            />
          </Form.Field>

          <Button primary>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
