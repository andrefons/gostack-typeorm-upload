/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (previousValue: Balance, currentValue: Transaction) => {
        switch (currentValue.type) {
          case 'income': {
            previousValue.income += currentValue.value;
            break;
          }
          case 'outcome': {
            previousValue.outcome += currentValue.value;
            break;
          }
          default:
            break;
        }

        return previousValue;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;
    return balance;
  }
}

export default TransactionsRepository;
