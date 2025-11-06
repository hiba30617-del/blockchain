// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    struct Campaign {
        uint id;
        string name;
        string description;
        address payable ngoAddress;
        uint totalDonations;
    }

    mapping(uint => Campaign) public campaigns;
    uint public campaignCount;

    event CampaignCreated(uint id, string name, address ngoAddress);
    event DonationReceived(uint id, address donor, uint amount);

    function createCampaign(
        string memory _name,
        string memory _description,
        address payable _ngoAddress
    ) public {
        campaignCount++;
        campaigns[campaignCount] = Campaign(campaignCount, _name, _description, _ngoAddress, 0);
        emit CampaignCreated(campaignCount, _name, _ngoAddress);
    }

    function donate(uint _id) public payable {
        require(_id > 0 && _id <= campaignCount, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];
        campaign.totalDonations += msg.value;
        campaign.ngoAddress.transfer(msg.value);
        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        return allCampaigns;
    }
}
