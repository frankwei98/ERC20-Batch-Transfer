// SPDX-License-Identifier: GPL

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract ERC20BatchTransfer {
    struct TransferCommand {
        address to;
        uint256 amount;
    }

    function batchTransfer(
        address token,
        TransferCommand[] memory transferCommands
    ) public {
        uint256 totalAmount;
        for (uint256 i = 0; i < transferCommands.length; i++) {
            totalAmount += transferCommands[i].amount;
        }
        require(
            IERC20(token).allowance(msg.sender, address(this)) >= totalAmount,
            "Token Allowance was not enough"
        );

        IERC20(token).transferFrom(msg.sender, address(this), totalAmount);

        for (uint256 i = 0; i < transferCommands.length; i++) {
            TransferCommand command = transferCommands[i];
            IERC20(token).transfer(command.to, command.amount);
        }
    }
}
