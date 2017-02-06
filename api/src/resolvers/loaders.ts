import DataLoader from 'dataloader'

export type ILoader<T> = DataLoader<number, T>;
export type ILoaderFactories = {[key: string]: () => ILoader<any>};
export type ILoaders = {[key: string]: ILoader<any>};

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
  ids: number[],
  items: T[],
  getId: (obj: T) => number,
) {
  const indices = ids.reduce<{[id: number]: number}>(
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
