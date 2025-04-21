/**
 * 在跨环境通信时，不是所有的数据类型都能直接进行传输，
 * 在传输过程中，这部分数据使用简单的结构体进行表示，
 * 远端接收到这部分数据后，再按照对应的协议转换为可以远程调用的值。
 * 本地端在通过回调收到数据后，通过协议内容再将其还原为原始值。
 */

import type { SchemaValueCallback, SchemaValueRef, SchemaEntity } from './schema';
import { fromEntries, entries } from '../shared/object';
import { isToken, Token } from './token';

export interface TransportableLocalOptions {
  /**
   * 名称，用于标记数据来源
   */
  name: string;

  /**
   * 远端的回调函数。
   */
  callback: TransportableRemoteCallback;
}

export type TransportableRemoteCallback = (callback: SchemaValueCallback, args: any[]) => Promise<SchemaEntity | void>;

export class Transportable {
  private refsMap: Map<string, any> = new Map();

  // 根据 value 索引 ref，以免同一个值重复生成 ref
  private valuesMap: WeakMap<any, string> = new WeakMap();

  private counter = 0;
  private callback: TransportableRemoteCallback;
  private name: string;

  constructor(options: TransportableLocalOptions) {
    this.name = options.name;
    this.callback = options.callback;
  }

  public createSchemaEntity(schema: unknown): Promise<SchemaEntity> {
    let token: Token;
    if (isToken(schema)) {
      token = schema;
    } else {
      token = new Token(schema);
    }

    return token.getSchemaEntity({
      name: this.name,
      createRefId: this.createRefId,
    });
  }

  public parseSchemaEntity(schema: SchemaEntity): any {
    switch (schema.type) {
      case 'data': {
        return schema.value;
      }

      case 'callback': {
        return this.parseSchemaCallback(schema);
      }

      case 'ref': {
        return this.parseSchemaRef(schema);
      }

      case 'array': {
        return schema.value.map((item) => this.parseSchemaEntity(item));
      }

      case 'map': {
        return fromEntries(entries(schema.value).map(([key, value]) => [key, this.parseSchemaEntity(value)]));
      }

      default: {
        // TODO: 抛出自定义错误
        throw new Error(`Unknown schema type: ${(schema as any).type}`);
      }
    }
  }

  public resolveSchemaCallback(schema: SchemaValueCallback): (...args: any[]) => Promise<SchemaEntity> {
    const callback = this.parseSchemaCallback(schema);

    return (...schemas: SchemaEntity[]) => {
      const args = schemas.map((schema) => this.parseSchemaEntity(schema));
      const result = callback(...args);

      return this.createSchemaEntity(result);
    };
  }

  private parseSchemaCallback(schema: SchemaValueCallback): (...args: any[]) => Promise<SchemaEntity> {
    // 如果 callback 来自远端，则需要代理
    if (schema.source !== this.name) {
      return async (...args: any[]) => {
        const result = await this.callback(schema, args);

        if (result) {
          return this.parseSchemaEntity(result);
        }

        return result;
      };
    } else {
      const ref = this.refsMap.get(schema.ref);
      if (!ref) {
        // TODO: 抛出自定义错误
        throw new Error(`Invalid reference: ${schema.ref}`);
      }
      return ref.value;
    }
  }

  private parseSchemaRef(schema: SchemaValueRef): Record<string, never> {
    if (schema.source !== this.name) {
      const proxy = new Proxy(
        {},
        {
          get(target, prop) {
            throw new Error('Unexpected remote property access');
          },
          set() {
            throw new Error('Unexpected remote property assignment');
          },
        },
      );

      return proxy;
    }

    const ref = this.refsMap.get(schema.ref);
    if (!ref) {
      // TODO: 抛出自定义错误
      throw new Error(`Invalid reference: ${schema.ref}`);
    }
    return ref.value;
  }

  /**
   * 为 value 生成一个 ref 并保存到 refs 中
   * @param value
   * @returns
   */
  private createRefId = (value: any): string => {
    const cachedRef = this.valuesMap.get(value);

    if (cachedRef) {
      return cachedRef;
    }

    const ref = this.generateRefId();

    this.refsMap.set(ref, value);

    // 缓存 ref 和 value 的映射
    this.valuesMap.set(value, ref);

    return ref;
  };

  private generateRefId() {
    return `#office-sdk-rpc@${this.counter++}`;
  }

  // TODO: 内存回收
  // public revoke(ref: string) {
  //   this.refs.delete(ref);
  // }
}
