import { ethers } from 'ethers';
import * as AWS from 'aws-sdk';
import 'dotenv/config';
import { mockUSDC, vaulerAddress, vaultAbi, vaults } from './helper/constant';

export async function handler(): Promise<void> {
  const provider = ethers.getDefaultProvider(process.env.ALCHEMY_URL);
  const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region:'ap-southeast-1'
  });

  for (let vault of vaults) {
    try {
      console.log(`Initiating the fetching of price of ${vault.vaultId}`);
      const vaultContract = new ethers.Contract(vaulerAddress, vaultAbi, provider);
      const price = await vaultContract.calculateSetTokenValuation(vault.address, mockUSDC);
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      const timestamp = block?.timestamp;
      console.log(`Updating data to AWS DB ${vault.vaultId}`);
      const params = {
        TableName: 'VaultPrices',
        Item: {
          VaultId: vault.vaultId,
          Timestamp: timestamp?.toString(),
          Price: ethers.formatUnits(price, 18),
        },
      };

      await dynamoDb.put(params).promise();
      console.log(`Finishing data to AWS DB ${vault.vaultId}`);
      console.log(`Price for ${vault.name}: ${ethers.formatUnits(price, 18)} saved at ${timestamp}`);
    } catch (error) {
      console.error(`Error fetching price for ${vault.name}:`, error);
    }
  }
};

handler();