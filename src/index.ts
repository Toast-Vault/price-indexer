import { ethers } from 'ethers';
import * as AWS from 'aws-sdk';

const provider = new ethers.AlchemyProvider('sepolia', 'YOUR_INFURA_PROJECT_ID');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface Vault {
  id: string;
  address: string;
}

const vaultAbi = [
  "function getPrice() public view returns (uint256)"
];

const vaults: Vault[] = [
  { id: 'Vault1', address: 'VAULT_CONTRACT_ADDRESS_1' },
  { id: 'Vault2', address: 'VAULT_CONTRACT_ADDRESS_2' },
  // Add more vaults here
];

export const handler = async (): Promise<void> => {
  for (let vault of vaults) {
    try {
      const vaultContract = new ethers.Contract(vault.address, vaultAbi, provider);
      const price = await vaultContract.getPrice();
      const timestamp = new Date().toISOString();

      const params = {
        TableName: 'VaultPrices',
        Item: {
          VaultID: vault.id,
          Timestamp: timestamp,
          Price: ethers.formatUnits(price, 18),
        },
      };

      await dynamoDb.put(params).promise();
      console.log(`Price for ${vault.id}: ${ethers.formatUnits(price, 18)} saved at ${timestamp}`);
    } catch (error) {
      console.error(`Error fetching price for ${vault.id}:`, error);
    }
  }
};