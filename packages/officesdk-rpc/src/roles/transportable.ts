/**
 * 在跨环境通信时，不是所有的数据类型都能直接进行传输，
 * 在传输过程中，这部分数据使用简单的结构体进行表示，
 * 远端接收到这部分数据后，再按照对应的协议转换为可以远程调用的值。
 * 本地端在通过回调收到数据后，通过协议内容再将其还原为原始值。
 */

/**
 * 可通过序列化或 structureClone 进行传输的数据类型，
 * 可以理解为 JSON 的超集，多了一个 undefined 类型。
 */
export type TransportableData =
  | string
  | number
  | boolean
  | null
  | undefined
  | TransportableData[]
  | { [key: string]: TransportableData };

interface TransportableLocalOptions {
  /**
   * 名称，用于标记数据来源
   */
  name: string;
}

export type TransportableCallbackDefinition = {
  type: 'callback';
  value: (...args: any[]) => void;
};

export type TransportableAnyDefinition = {
  type: 'any';
  value: any;
};

export type TransportableLocalRefDefinition = TransportableCallbackDefinition | TransportableAnyDefinition;

export type TransportableLocalDataDefinition = {
  type: 'data';
  data: TransportableData;
};

export type TransportableLocalArrayDefinition = {
  type: 'array';
  array: TransportableLocalDefinition[];
};

export type TransportableLocalMapDefinition = {
  type: 'map';
  map: {
    [key: string]: TransportableLocalDefinition;
  };
};

export type TransportableLocalDefinition =
  | TransportableLocalRefDefinition
  | TransportableLocalDataDefinition
  | TransportableLocalArrayDefinition
  | TransportableLocalMapDefinition;

export type TransportableRemoteCallbackDefinition = {
  type: 'callback';
  source: string;
  ref: string;
};

export type TransportableRemoteAnyDefinition = {
  type: 'any';
  source: string;
  ref: string;
};

export type TransportableRemoteRefDefinition = TransportableRemoteCallbackDefinition | TransportableRemoteAnyDefinition;

export type TransportableRemoteDataDefinition = {
  type: 'data';
  data: TransportableData;
};

export type TransportableRemoteArrayDefinition = {
  type: 'array';
  array: TransportableRemoteDefinition[];
};

export type TransportableRemoteMapDefinition = {
  type: 'map';
  map: {
    [key: string]: TransportableRemoteDefinition;
  };
};

export type TransportableRemoteDefinition =
  | TransportableRemoteRefDefinition
  | TransportableRemoteDataDefinition
  | TransportableRemoteArrayDefinition
  | TransportableRemoteMapDefinition;

export class Transportable {
  private refs: Map<string, TransportableLocalRefDefinition> = new Map();
  private counter = 0;

  private name: string;

  constructor(options: TransportableLocalOptions) {
    this.name = options.name;
  }

  public createRemote(definition: TransportableLocalDefinition): TransportableRemoteDefinition {
    return {
      type: definition.type,
      source: this.name,
      ref: this.generateRefId(),
    };
  }

  public parseRemote(definition: TransportableRemoteDefinition): TransportableLocalDefinition {
    return {
      type: definition.type,
      data: definition.data,
    };
  }

  private generateRefId() {
    return `#office-sdk-rpc@${this.counter++}`;
  }

  // TODO: 内存回收
  // public revoke(ref: string) {
  //   this.refs.delete(ref);
  // }
}
