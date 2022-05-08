// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';

declare global {
  namespace Express {
    interface User {
      name: string | null;
      last_name: string | null;
      username: string;
      id_user: number;
      email: string;
      password: string;
      picture: string | null;
      status: number;
      tr_id: string | null;
      tr_date: Date | null;
      tr_user_id: number | null;
      tr_ip: string | null;
    }

    interface Transaction {
      tr_id?: string | null;
      tr_date?: Date | null;
      tr_user_id?: number | null;
      tr_ip?: string | null;
    }

    interface Request {
      transaction?: Transaction;
    }
  }
}