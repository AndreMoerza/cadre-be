import { EntityManager, Repository } from 'typeorm';

/**
 * Executes a callback function within a transaction using the provided repository and transactional entity manager.
 * @param repository - The repository to be used within the transaction.
 * @returns A promise that resolves to the result of the callback function.
 * @example
 * ```ts
 * const user = await withTransaction(UserAccount)(async (repository, manager) => {
 *   ... your transactional logic logic here ...
 *   return await repository.save(user);
 * });
 * ```
 */
export function withTransaction<T>(repository: Repository<T>) {
  return async <R>(
    callback: (repository: Repository<T>, manager: EntityManager) => Promise<R>,
  ): Promise<R> => {
    return await repository.manager.transaction(
      async (transactionalEntityManager) => {
        const target = transactionalEntityManager.getRepository(
          repository.target,
        );
        return await callback(target, transactionalEntityManager);
      },
    );
  };
}
