import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<boolean> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!id) throw new AppError('Invalid parameter id');

    const findTransaction = await transactionsRepository.findOne({
      where: { id },
    });
    if (!findTransaction)
      throw new AppError('Cannot find especified transaction');

    const deleted = await transactionsRepository.delete({ id });

    return deleted.affected != null;
  }
}

export default DeleteTransactionService;
