// Minimal ABI for GlassFill front-end integration.
// NOTE: Replace this with the deployed contract ABI when available.

export const glassFillAbi = [
  {
    type: "event",
    name: "GameCreated",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "opponent", type: "address", indexed: true },
      { name: "isEthPlayer", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "TurnPlayed",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "player", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "newTotal", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "GameOver",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "winner", type: "address", indexed: true },
      { name: "loser", type: "address", indexed: true },
      { name: "winningsEth", type: "uint256", indexed: false },
      { name: "feeEth", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdrawal",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "amountEth", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "createGame",
    inputs: [
      { name: "opponent", type: "address" },
      { name: "isEthPlayer", type: "bool" },
    ],
    outputs: [{ name: "gameId", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "joinGame",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "payable",
    name: "playTurn",
    inputs: [{ name: "gameId", type: "uint256" }, { name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "withdraw",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "getGame",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "ethPlayer", type: "address" },
          { name: "monPlayer", type: "address" },
          { name: "currentAmount", type: "uint256" },
          { name: "limit", type: "uint256" },
          { name: "isEthTurn", type: "bool" },
          { name: "status", type: "uint8" },
          { name: "ethInPot", type: "uint256" },
          { name: "monInPot", type: "uint256" },
        ],
      },
    ],
  },
];

export const GLASSFILL_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: replace


