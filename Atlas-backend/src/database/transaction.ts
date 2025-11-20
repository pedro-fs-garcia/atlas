import { AppDataSource } from './data-source';

export async function transaction<T>(fn: (manager:any) => Promise<T>): Promise<T> {
  return AppDataSource.manager.transaction(async (manager) => {
    return fn(manager);
  });
}
