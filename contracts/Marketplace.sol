// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Marketplace{
    constructor() public{
        _owner = msg.sender;
        status = ShippingStatus.Pending;
    }

    /*
    Pending = 0,
    Shipped = 1,
    Delivered = 2
    */
    enum ShippingStatus{
        Pending, 
        Shipped,
        Delivered
    }

    ShippingStatus private status;

    address public _owner;

    event PackageShipped();
    event MissionComplete();

    modifier ownerOnly{
        require(_owner == msg.sender, "L'acces a cette fonction est reserver");
        _;
    }

    modifier costumerOnly{
        require(_owner != msg.sender);
        _;
    }

    function Shipped() external ownerOnly{
        status = ShippingStatus.Shipped;
        emit PackageShipped();
    }

    function Delivered() external ownerOnly{
        emit MissionComplete();
        status = ShippingStatus.Delivered;
    }

    function getStatus() public view ownerOnly returns(ShippingStatus) {
        return status;
    }

    function Status() public payable costumerOnly returns(ShippingStatus){
        return status;
    }
}