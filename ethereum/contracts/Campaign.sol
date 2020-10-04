pragma solidity ^0.4.17;

// deploys a new campaign and stores it in the deployedCampaigns array
contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    // contract level (or state) variables are stored in storage
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign (uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        // if donators contribution > minimumContribution that person is added (in form of a new key) //
        // to the approvers mapping and gives it the value of true //
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        require(approvers[msg.sender]);
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        // the storage keyword makes sure that we manipulate what is returned by requests[index]
        // and not a copy of it (as happens when using the memory keyword)
        Request storage request = requests[index];
        // checks if user that calls the function has donated enough money
        require(approvers[msg.sender]);
        // checks if user that calls the function hasn't voted already
        require(!request.approvals[msg.sender]);
        // user is beeing added to approvals array in the request object
        request.approvals[msg.sender] = true;
        // update number of approvals on request
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        // checks if > 50 % of contributors (here ineptly called approvers) approve of request
        require(request.approvalCount > (approversCount / 2));
        // checks if request is not completed already
        require(!request.complete);
        // sends the money to it's destination
        request.recipient.transfer(request.value);
         
        request.complete = true;
    }
}