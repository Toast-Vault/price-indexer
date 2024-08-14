import { ethers } from 'ethers';
import * as AWS from 'aws-sdk';
import 'dotenv/config';
import { vaultAbi, vaults } from './helper/constant';

const provider = new ethers.AlchemyProvider('sepolia', process.env.ALCHEMY_URL);
const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const handler = async (): Promise<void> => {
  for (let vault of vaults) {
    try {
      const vaultContract = new ethers.Contract(vault.address, vaultAbi, provider);
      const price = await vaultContract.calculateSetTokenValuation(vault.address, );
      const timestamp = new Date().toISOString();

      const params = {
        TableName: 'VaultPrices',
        Item: {
          VaultID: vault.name,
          Timestamp: timestamp,
          Price: ethers.formatUnits(price, 18),
        },
      };

      await dynamoDb.put(params).promise();
      console.log(`Price for ${vault.name}: ${ethers.formatUnits(price, 18)} saved at ${timestamp}`);
    } catch (error) {
      console.error(`Error fetching price for ${vault.name}:`, error);
    }
  }
};