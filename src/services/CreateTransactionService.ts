import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome')
      throw new AppError('Transaction not permited');

    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total)
      throw new AppError('You cannot do this transaction.');

    let findCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!findCategory) {
      findCategory = await categoriesRepository.save({ title: category });
    }

    const transaction = await transactionsRepository.save({
      title,
      value,
      type,
      category_id: findCategory.id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
