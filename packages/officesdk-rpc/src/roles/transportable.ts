/**
 * 在跨环境通信时，不是所有的数据类型都能直接进行传输，
 * 在传输过程中，这部分数据使用简单的结构体进行表示，
 * 远端接收到这部分数据后，再按照对应的协议转换为可以远程调用的值。
 * 本地端在通过回调收到数据后，通过协议内容再将其还原为原始值。
 */

import { iteratePath, fromEntries, entries } from '../shared/object';

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

  /**
   * 远端的回调函数。
   */
  callback: TransportableRemoteCallback;
}

// TODO: 目前回调函数仅支持交换数据，不支持交换引用。
export type TransportableRemoteCallback = (
  schema: TransportableCallbackSchema,
  args: TransportableData[],
) => Promise<TransportableData | void>;

export type TransportableLocalCallback = {
  type: 'callback';
  value: (...args: any[]) => void;
};

export type TransportableLocalAny = {
  type: 'any';
  value: any;
};

export type TransportableLocalRef = TransportableLocalCallback | TransportableLocalAny;

export type TransportableLocalData = {
  type: 'data';
  data: TransportableData;
};

export type TransportableLocalArray = {
  type: 'array';
  array: TransportableLocal[];
};

export type TransportableLocalMap = {
  type: 'map';
  map: {
    [key: string]: TransportableLocal;
  };
};

export type TransportableLocal =
  | TransportableLocalRef
  | TransportableLocalData
  | TransportableLocalArray
  | TransportableLocalMap;

export type TransportableCallbackSchema = {
  type: 'callback';
  source: string;
  ref: string;
};

export type TransportableAnySchema = {
  type: 'any';
  source: string;
  ref: string;
};

export type TransportableRefSchema = TransportableCallbackSchema | TransportableAnySchema;

export type TransportableDataSchema = {
  type: 'data';
  data: TransportableData;
};

export type TransportableArraySchema = {
  type: 'array';
  array: TransportableSchema[];
};

export type TransportableMapSchema = {
  type: 'map';
  map: {
    [key: string]: TransportableSchema;
  };
};

export type TransportableSchema =
  | TransportableRefSchema
  | TransportableDataSchema
  | TransportableArraySchema
  | TransportableMapSchema;

/**
 * 定义如何将任意一个值转换为 TransportableSchema 的规则
 */
export type TransportableRule = {
  type: 'callback' | 'any' | 'map' | 'array' | 'data';
  path?: string;
};

export type TransportableRuleItem = {
  type: 'callback' | 'any' | 'map' | 'array' | 'data';
  path: string;
};

export type TransportableRules = [TransportableRule] | [TransportableRuleItem, ...TransportableRuleItem[]];

const TransportableProxyValue = Symbol('TransportableProxyValue');

type TransportableProxy<T> = T & {
  [TransportableProxyValue]: TransportableSchema;
};

export class Transportable {
  private refsMap: Map<string, TransportableLocalRef> = new Map();

  // 根据 value 索引 ref，以免同一个值重复生成 ref
  private valuesMap: WeakMap<any, string> = new WeakMap();

  private counter = 0;
  private callback: TransportableRemoteCallback;
  private name: string;

  constructor(options: TransportableLocalOptions) {
    this.name = options.name;
    this.callback = options.callback;
  }

  /**
   * 根据传入的 rules 将 value 转为 TransportableSchema，
   * rules 需要指定 value 中存在的 callback、any 等非 TransportableData 值的路径。
   *
   * @param value
   * @param rules
   * @example
   * 如果 value 符合 TransportableData 类型，则可直接传输的数据，此时 rules 留空即可。
   * parseRules({
   *   a: [1, 2, 3]
   * }) => {
   *   type: 'data',
   *   data: {
   *     a: [1, 2, 3]
   *   }
   * }
   *
   * 如果 value 为函数，需要指定 rule 为 type: 'callback' ，不需要指定 path。
   * parseRules(() => {}, [
   *   { type: 'callback' },
   * ]) => {
   *   type: 'callback',
   *   source: 'a',
   *   ref: '#office-sdk-rpc@0'
   * }
   *
   * 如果 value 为任意无法直接传输的数据，需要指定 rule 为 type: 'any' ，不需要指定 path。
   * parseRules(window, [
   *   { type: 'any' },
   * ]) => {
   *   type: 'any',
   *   source: 'a',
   *   ref: '#office-sdk-rpc@0'
   * }
   *
   * 如果 value 为数组或对象，但里面嵌套了部分无法直接传输的数据，需要指定 rule 为 type: 'map' 或 type: 'array' ，并指定 path 对应着部分无法直接传输的数据。
   * parseRules({
   *   a: 1,
   *   b: () => {},
   * }, [
   *   { type: 'callback', path: 'b' },
   * ]) => {
   *   type: 'map',
   *   map: {
   *     a: { type: 'data', data: 1 },
   *     b: { type: 'callback', source: 'a', ref: '#office-sdk-rpc@0' },
   *   },
   * }
   *
   * parseRules([1, () => {}], [
   *   { type: 'callback', path: '1' },
   * ]) => {
   *   type: 'array',
   *   array: [
   *     { type: 'data', data: 1 },
   *     { type: 'callback', source: 'a', ref: '#office-sdk-rpc@0' },
   *   ],
   * }
   */
  public createSchema(value: any, rules?: TransportableRules): TransportableSchema {
    // 如果 value 是回调函数，忽略 rules 直接返回 callback 类型的 schema
    if (typeof value === 'function') {
      return this.parseRule(value, { type: 'callback' });
    }

    // 如果 value 为空或没有 rules，则表示 value 为可以直接传输的数据，直接返回 data 类型的 schema
    if (!rules?.length || !value) {
      return {
        type: 'data',
        data: value,
      };
    }

    let [first, ...others] = rules;

    // 如果只有一条规则，不需要遍历
    if (!others.length && !first.path) {
      return this.parseRule(value, first);
    }

    let schema: TransportableSchema = this.nestValue(value);

    let index = 0;
    let rule = others[index];

    while (rule) {
      iteratePath(schema, rule.path, (value, current, key, isLast) => {
        if (isLast) {
          // 如果这是最后一个 key，则使用 rule 进行处理
          current[key] = this.parseRule(value, rule);
        } else {
          // 这是中间的 key，需要使用 rule 进行处理
          current[key] = this.nestValue(value);
        }
      });

      rule = others[++index];
    }

    return schema;
  }

  public parseSchema(schema: TransportableSchema): any {
    switch (schema.type) {
      case 'data': {
        return schema.data;
      }

      case 'callback':
      case 'any': {
        // 如果 source 不属于当前实例，则直接返回 schema
        if (schema.source !== this.name) {
          return this.proxyRemote(schema);
        }

        // 从 refsMap 中获取保存的引用值
        const ref = this.refsMap.get(schema.ref);
        if (!ref) {
          // TODO: 抛出自定义错误
          throw new Error(`Invalid reference: ${schema.ref}`);
        }
        return ref.value;
      }

      case 'array': {
        return schema.array.map((item) => this.parseSchema(item));
      }

      case 'map': {
        return fromEntries(entries(schema.map).map(([key, value]) => [key, this.parseSchema(value)]));
      }

      default: {
        // TODO: 抛出自定义错误
        throw new Error(`Unknown schema type: ${(schema as any).type}`);
      }
    }
  }

  /**
   * 将中间值转换为 TransportableSchema，比如说 path 为 a.b.c 时，
   * a、b 为中间值，c 为最终值，只有 c 才能使用 rule 转为 TransportableSchema，
   * a、b 需要使用 nestValue 转换为 TransportableSchema。
   * @param value
   * @returns
   */
  private nestValue(value: any): TransportableSchema {
    return this.parseRule(value, {
      type: Array.isArray(value) ? 'array' : 'map',
    });
  }

  private proxyRemote(value: TransportableCallbackSchema | TransportableAnySchema): TransportableProxy<any> {
    if (value.type === 'callback') {
      const callback = (...args: any[]) => {
        // TODO: callback 间调用仅支持交换数据
        return this.callback(value, args);
      };
      callback[TransportableProxyValue] = value;
      return callback;
    }

    if (value.type === 'any') {
      // TODO: 如何使用
      const proxy = new Proxy(
        {},
        {
          get(target, prop) {
            if (prop === TransportableProxyValue) {
              return value;
            }

            throw new Error('Unexpected remote property access');
          },
          set() {
            throw new Error('Unexpected remote property assignment');
          },
        },
      );

      return proxy;
    }
  }

  private parseRule(value: any, rule: TransportableRule): TransportableSchema {
    switch (rule.type) {
      case 'callback':
        if (typeof value === 'function') {
          return {
            type: 'callback',
            source: this.name,
            ref: this.saveRef({
              type: 'callback',
              value,
            }),
          };
        }
        break;

      case 'any':
        return {
          type: 'any',
          source: this.name,
          ref: this.saveRef({
            type: 'any',
            value,
          }),
        };

      case 'array':
        if (Array.isArray(value)) {
          return {
            type: 'array',
            array: value.map((item) => this.createSchema(item)),
          };
        }
        break;

      case 'map':
        if (typeof value === 'object' && value !== null) {
          return {
            type: 'map',
            map: fromEntries(entries(value).map(([k, v]) => [k, this.createSchema(v)])),
          };
        }
        break;
    }

    // 如果类型不匹配，返回数据类型
    return {
      type: 'data',
      data: value,
    };
  }

  /**
   * 为 value 生成一个 ref 并保存到 refs 中
   * @param value
   * @returns
   */
  private saveRef(value: TransportableLocalRef): string {
    const cachedRef = this.valuesMap.get(value);

    if (cachedRef) {
      return cachedRef;
    }

    const ref = this.generateRefId();

    this.refsMap.set(ref, value);

    // 缓存 ref 和 value 的映射
    this.valuesMap.set(value, ref);

    return ref;
  }

  private generateRefId() {
    return `#office-sdk-rpc@${this.counter++}`;
  }

  // TODO: 内存回收
  // public revoke(ref: string) {
  //   this.refs.delete(ref);
  // }
}
