
export enum DataStorageAction {
  /**
   * It's a data limiter in case the API 
   * forces the library or even you want to limit the amount of data you want stored in the library or in the base of your bot.
   */
  Limiter,
  /**
   * When reaching the data limit automatically the last one will be removed and added to the first in the queue.
   */
  DifferentialLimiter,
  None
}

export enum ResourceDataStorage {
  /**
   * You want to turn this cached data manager into a collector to store and notify by events.
   */
  Collector,
  /**
   * Add time to the data.
   */
  TTLStorage,
  None
}

export class DataPackage<Package> {
  ttl?: number;
  data?: Package;
  constructor(data: Package, ttl?: number) {
    if (data !== undefined) {
      this.data = data
    }
    if (ttl !== undefined) {
      this.ttl = ttl
    }
  }
}

export class Data<Package> {
  id?: string;
  created: number;
  ttl?: number;
  data?: Package;
  constructor(id?: string, data?: DataPackage<Package>) {
    if (id !== undefined) {
      this.id = id
    }
    if (data?.ttl !== undefined) {
      this.ttl = data.ttl
    }
    if (data?.data !== undefined) {
      this.data = data.data
    }
    this.created = Date.now()

  }
}

export interface DataStorageOptions {
  limiter?: number;
  ttlStorage?: number;
  action?: DataStorageAction;
  resources?: ResourceDataStorage;
}

interface DataInfo<D> {
  id?: string;
  data: D | DataPackage<D>;
  ttl: 0;
  requireTTL: boolean;
}

export class DataStorageBase<D> extends Array<Data<D>> {
  limiter?: number;
  ttlStorage?: number;
  action: DataStorageAction;
  resources: ResourceDataStorage;
  // To avoid big error spam!
  warned: boolean;
  constructor(options: DataStorageOptions) {
    super();
    if (options?.limiter !== undefined) {
      this.limiter = options?.limiter;
    }
    if (options?.ttlStorage !== undefined) {
      this.ttlStorage = options?.ttlStorage;
    }
    if (options?.action !== undefined) {
      this.action = options?.action;
    } else {
      this.action = DataStorageAction.None;
    }
    if (options?.resources !== undefined) {
      this.resources = options.resources
    } else {
      this.resources = ResourceDataStorage.None
    }
    this.warned = false;
  }

  clearAll() {
    for (let _ of this) {
      this.pop()
    }
    this.pop()
    return this;
  }

  remove(id: string) {
    let nb = -1;
    let data;
    for (let a of this) {
      nb++;
      if (a.id !== undefined) {
        if (a.id === id) {
          data = a
          this.splice(nb, 0)
          break;
        }
      }
    }
    return data
  }

  add(data: DataInfo<D>) {
    if (data !== undefined) {
      if (data.ttl !== undefined) {
        if (data.requireTTL !== undefined && data.requireTTL) {
          if (this.resources !== ResourceDataStorage.TTLStorage) {
            throw new Error('This data manager does not support this.')
          } else {
            if (data.data instanceof DataPackage) {
              this.push(new Data(data?.id, data.data))
              return this
            }
          }
        }
      }
      if (data.data instanceof DataPackage) {
        this.push(new Data(data?.id, data.data))
        return this
      }
    }
    return this
  }

  get(id: string) {
    let data;
    for (let a of this) {
      if (a.id !== undefined) {
        if (a.id === id) {
          data = a
          break;
        }
      }
    }
    return data
  }

  static createWithLimiter<D>(limit: number) {
    return DataStorageBase.createBase<D>({
      limiter: limit,
      ttlStorage: -1,
      action: DataStorageAction.Limiter
    })
  }
  static createWithDifferentialLimiter<D>(limit: number) {
    return DataStorageBase.createBase<D>({
      limiter: limit,
      ttlStorage: -1,
      action: DataStorageAction.DifferentialLimiter
    })
  }
  static createWithTtl<D>(ttl: number) {
    return DataStorageBase.createBase<D>({
      limiter: -1,
      ttlStorage: ttl,
      action: DataStorageAction.None
    })
  }
  static createBase<D>(options: DataStorageOptions) {
    return new DataStorageBase<D>(options)
  }
}