import fs from 'fs';
import csv from 'csv-parse';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      const createTransactionService = new CreateTransactionService();
      const tempTransactions = new Array<any>();
      const transactions = new Array<Transaction>();

      fs.createReadStream(filename)
        .pipe(csv())
        .on('data', row => {
          if (!row.includes('title')) {
            tempTransactions.push({
              title: row[0].trim(),
              type: row[1].trim(),
              value: row[2].trim(),
              category: row[3].trim(),
            });
          }
        })
        .on('end', async () => {
          if (tempTransactions.length <= 0)
            throw new AppError('No transactions to proccess');

          transactions.push(
            ...(await Promise.all(
              tempTransactions.map(async element => {
                const createTransaction = await createTransactionService.execute(
                  element,
                );

                return createTransaction;
              }),
            )),
          );
          resolve(transactions);
        })
        .on('error', err => {
          reject(err);
        });
    });
  }
}

export default ImportTransactionsService;
