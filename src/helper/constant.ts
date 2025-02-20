// Quote Token Addresses
export const mockUSDC = "0x473a827b9B50b2a8A711493C9F80CFeE96f3Be97";
export const vaulerAddress = "0x012d6bC94051C3b9F923c043A51D381903EAC16A"
// Vault Addresses
interface Vault {
  vaultId:string;
    name: string;
    address: string;
  }
  
export const vaults: Vault[] = [
    { vaultId:"vault_1", name: "USDCBTCLINK",  address: "0xd995E679A577C29Ad7E06d1e3d194c961930E590" },
    // Add more vaults here
];

// Vault Abi
export const vaultAbi = [{"inputs":[{"internalType":"contract IController","name":"_controller","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"contract ISetToken","name":"_setToken","type":"address"},{"internalType":"address","name":"_quoteAsset","type":"address"}],"name":"calculateSetTokenValuation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"contract IController","name":"","type":"address"}],"stateMutability":"view","type":"function"}];