import * as DataLoader from 'dataloader'

export type ID = number | string;
export type ILoaderFactories = {[key: string]: () => DataLoader<ID, any>};

export interface ILoaders {
  [key: string]: DataLoader<ID, any>;
}

export interface IWithLoaders {
  loaders?: ILoaders,
}

export interface IRequest extends Express.Request, IWithLoaders {}

export function createLoaders(loaderFactories: ILoaderFactories): ILoaders {
  const loaders = {};

  for (const key in loaderFactories) {
    loaders[key] = loaderFactories[key]();
  }

  return loaders;
}

export function createLoadersMiddleware(loaderFactories: ILoaderFactories) {
  return (req: IRequest, res, next: Function) => {
    req.loaders = createLoaders(loaderFactories);
    next();
  };
}

export function collect<T>(
  ids: Array<ID>,
  items: T[],
  getId: (obj: T) => ID,
) {
  const indices = ids.reduce<{[id: string]: number}>(
    (indices, id, index) => {
      indices[id] = index;
      return indices;
    },
    {},
  );

  return items.sort(
    (item, other) => indices[getId(item)] - indices[getId(other)]
  );
}
