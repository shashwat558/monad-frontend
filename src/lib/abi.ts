// Minimal ABI placeholder. Replace with your deployed contract ABI.
export const glassFillAbi = [
  {
    type: "function",
    name: "createGame",
    stateMutability: "nonpayable",
    inputs: [
      { name: "opponent", type: "address" },
      { name: "isEthPlayer", type: "bool" },
    ],
    outputs: [{ name: "gameId", type: "uint256" }],
  },
  { type: "function", name: "joinGame", stateMutability: "nonpayable", inputs: [{ name: "gameId", type: "uint256" }], outputs: [] },
  { type: "function", name: "playTurn", stateMutability: "payable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { type: "function", name: "withdraw", stateMutability: "nonpayable", inputs: [{ name: "gameId", type: "uint256" }], outputs: [] },
  { type: "event", name: "GameCreated", inputs: [{ name: "gameId", type: "uint256", indexed: true },{ name: "playerA", type: "address", indexed: true },{ name: "playerB", type: "address", indexed: true }], anonymous: false },
  { type: "event", name: "TurnPlayed", inputs: [{ name: "gameId", type: "uint256", indexed: true },{ name: "player", type: "address", indexed: true },{ name: "amount", type: "uint256", indexed: false },{ name: "newTotal", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "GameOver", inputs: [{ name: "gameId", type: "uint256", indexed: true },{ name: "winner", type: "address", indexed: true },{ name: "loser", type: "address", indexed: true },{ name: "winningsEth", type: "uint256", indexed: false }], anonymous: false },
  { type: "event", name: "Withdrawal", inputs: [{ name: "player", type: "address", indexed: true },{ name: "amount", type: "uint256", indexed: false }], anonymous: false },
];

export const GLASSFILL_ADDRESS: `0x${string}` = "0x7EfBF7E0291E359Fa778eC9143b98c2aD241e49A";


