import { v4 as uuid } from 'uuid';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionAndBalance {
  transactions: Transaction[];
  balance: Balance;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionAndBalance {
    return {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
  }

  public getBalance(): Balance {
    let totalIncome = 0;
    let totalOutcome = 0;

    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.value;
      } else {
        totalOutcome += transaction.value;
      }
    });

    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const newTransaction = {
      id: uuid(),
      title,
      value,
      type,
    };

    this.transactions.push(newTransaction);

    return newTransaction;
  }

  public validValue(value: number): true | null {
    const balance = this.getBalance();

    return value > balance.total ? null : true;
  }
}

export default TransactionsRepository;
