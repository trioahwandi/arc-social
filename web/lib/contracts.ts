export const CONTRACT_ADDRESSES = {
  ProfileRegistry: "0x409c35d67ed0EbA2670139df0662854692649d00",
  FeedContract: "0x27611Ac740e840eb428fbDf9136C5132c1446A22",
  TipContract: "0x91E563C6ffa58005ed134c2f8E2bBCa032533dC1",
} as const;

export const PROFILE_REGISTRY_ABI = [
  {
    name: "register",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_username", type: "string" },
      { name: "_metadataURI", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "getProfile",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_wallet", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "wallet", type: "address" },
          { name: "username", type: "string" },
          { name: "metadataURI", type: "string" },
          { name: "registeredAt", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "hasProfile",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "usernameTaken",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "string" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "ProfileCreated",
    type: "event",
    inputs: [
      { name: "wallet", type: "address", indexed: true },
      { name: "username", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const FEED_CONTRACT_ABI = [
  {
    name: "createPost",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_contentURI", type: "string" },
      { name: "_contentHash", type: "bytes32" },
      { name: "_parentId", type: "bytes32" },
    ],
    outputs: [{ name: "postId", type: "bytes32" }],
  },
  {
    name: "getPost",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_postId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "bytes32" },
          { name: "author", type: "address" },
          { name: "contentHash", type: "bytes32" },
          { name: "contentURI", type: "string" },
          { name: "parentId", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "getGlobalFeed",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_offset", type: "uint256" },
      { name: "_limit", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes32[]" }],
  },
  {
    name: "follow",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_target", type: "address" }],
    outputs: [],
  },
  {
    name: "unfollow",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_target", type: "address" }],
    outputs: [],
  },
  {
    name: "isFollowing",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getFollowingCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getFollowersCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "PostCreated",
    type: "event",
    inputs: [
      { name: "postId", type: "bytes32", indexed: true },
      { name: "author", type: "address", indexed: true },
      { name: "parentId", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const TIP_CONTRACT_ABI = [
  {
    name: "tipPost",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_postId", type: "bytes32" },
      { name: "_creator", type: "address" },
      { name: "_amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "getTotalTips",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_postId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "TipSent",
    type: "event",
    inputs: [
      { name: "postId", type: "bytes32", indexed: true },
      { name: "tipper", type: "address", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;