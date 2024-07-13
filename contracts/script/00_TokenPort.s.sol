// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import "./Helper.sol";
import {TokenPort} from "../src/TokenPort.sol";

contract DeployTokenPort is Script, Helper {
    function run(SupportedNetworks network, uint256 initFund) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        (address router,,,) = getConfigFromNetwork(network);

        TokenPort tokenPort = new TokenPort(router);
        (bool sent,) = address(tokenPort).call{value: initFund}("");

        console.log("TokenPort contract deployed on ", networks[network], "with address: ", address(tokenPort));
        require(sent, "Failed to send funds to TokenPort contract");

        vm.stopBroadcast();
    }
}
