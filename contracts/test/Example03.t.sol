// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {
    CCIPLocalSimulator,
    IRouterClient,
    LinkToken,
    BurnMintERC677Helper
} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {BasicTokenSender} from "../src/BasicTokenSender.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

contract Example03Test is Test {
    CCIPLocalSimulator public ccipLocalSimulator;
    BasicTokenSender public basicTokenSender;
    address public alice;
    address public bob;

    uint64 public destinationChainSelector;
    BurnMintERC677Helper public ccipBnMToken;

    uint256 private constant ALICE_PRIVATE_KEY = 0xa11ce;
    uint256 private constant DEADLINE = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;


    function setUp() public {
        ccipLocalSimulator = new CCIPLocalSimulator();

        (uint64 chainSelector, IRouterClient sourceRouter,,, LinkToken link, BurnMintERC677Helper ccipBnM,) =
            ccipLocalSimulator.configuration();

        destinationChainSelector = chainSelector;
        ccipBnMToken = ccipBnM;

        basicTokenSender = new BasicTokenSender(address(sourceRouter), address(link));

        alice = vm.addr(ALICE_PRIVATE_KEY);
        bob = makeAddr("bob");
    }

    function prepareScenario()
        public
        returns (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend)
    {
        vm.startPrank(alice);

        ccipBnMToken.drip(alice);

        amountToSend = 100;
        ccipBnMToken.approve(address(basicTokenSender), amountToSend);

        tokensToSendDetails = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenToSendDetails =
            Client.EVMTokenAmount({token: address(ccipBnMToken), amount: amountToSend});
        tokensToSendDetails[0] = tokenToSendDetails;

        vm.stopPrank();
    }

    function test_transferTokensFromSmartContractAndPayFeesInLink() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);

        vm.startPrank(alice);
        ccipLocalSimulator.requestLinkFromFaucet(address(basicTokenSender), 5 ether);
        basicTokenSender.send(destinationChainSelector, bob, tokensToSendDetails, BasicTokenSender.PayFeesIn.LINK);
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);

        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }

    function test_transferTokensFromSmartContractAndPayFeesInNative() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);

        vm.startPrank(alice);
        deal(address(basicTokenSender), 5 ether);
        basicTokenSender.send(destinationChainSelector, bob, tokensToSendDetails, BasicTokenSender.PayFeesIn.Native);
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);

        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }

    function test_transferTokensWithPermit() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");

        // Generate permit signature
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            senderPrivateKey,
            address(ccipBnMToken),
            address(basicTokenSender),
            amountToSend,
            0, // nonce
            DEADLINE
        );

        vm.startPrank(alice);
        ccipLocalSimulator.requestLinkFromFaucet(address(basicTokenSender), 5 ether);
        
        basicTokenSender.sendWithPermit(
            destinationChainSelector,
            bob,
            address(ccipBnMToken),
            amountToSend,
            DEADLINE,
            v,
            r,
            s,
            BasicTokenSender.PayFeesIn.LINK
        );
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);

        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }
    function _getPermitSignature(
        uint256 privateKey,
        address token,
        address spender,
        uint256 value,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (uint8 v, bytes32 r, bytes32 s) {
        bytes32 domainSeparator = IERC20Permit(token).DOMAIN_SEPARATOR();
        bytes32 permitTypehash = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
        
        bytes32 structHash = keccak256(abi.encode(
            permitTypehash,
            vm.addr(privateKey),
            spender,
            value,
            nonce,
            deadline
        ));

        bytes32 hash = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        
        (v, r, s) = vm.sign(privateKey, hash);
    }
}