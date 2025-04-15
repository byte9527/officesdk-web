import { iteratePath, fromEntries, entries } from '../shared/object';
import type { Cloneable } from '../shared/cloneable';
import type { SchemaEntity, SchemaStructured, SchemaValueCallback, SchemaValueRef, SchemaValueData } from './schema';

/**
 * 定义传入的数据通过 Token 转换为 schema 的规则，
 * 需要特殊转换后传输的数据，绝大多数都是一个对象或是函数，
 * 此时需要指定着部分需要转换的数据在 value 中的路径，
 * 举几个常规的 rule 关系：
 * value: window ==> [{ type: 'ref', path: '&' }]
 * value: { foo: document } ==> [{ type: 'ref', path: '&.foo' }]
 * value: () => {} ==> [{ type: 'callback', path: '&' }]
 * value: { foo: () => {} } ==> [{ type: 'callback', path: '&.foo' }]
 * value: [window] ==> [{ type: 'array', path: '&' }, { type: 'ref', path: '&[0]' }]
 * value: { foo: [window] } ==> [{ type: 'map', path: '&' }, { type: 'array', path: '&.foo' }, { type: 'ref', path: '&.foo[0]' }]
 */
export interface TokenRule {
  type: 'callback' | 'ref' | 'map' | 'array';
  path: `&${string}`;
}

function getDescendantPath(path: `&${string}`): string {
  return path.slice(1);
}

/**
 * rules 数组的长度至少为 1。
 */
export type TokenRules = [TokenRule, ...TokenRule[]];

/**
 * 初始化 Token 的配置
 */
export interface TokenOptions {
  rules: TokenRules;
}

/**
 * 可以自动识别进行转换的数据类型，
 * 这类数据也不依赖 rule 进行转换。
 */
export type SmartData = Cloneable | Function | Promise<SmartData>;

export interface TokenContext {
  createRefId(value: { type: 'callback' | 'ref'; value: any }): string;
  name: string;
}

/**
 * Token 的主要作用是将无法跨环境传输的数据封装为可以跨环境传输的数据或引用参数，
 * 理论上可以将任意数据封装为 Token，但封装为引用类型的数据只能跨环境作为参数引用，不能在其他环境中直接使用。
 */
export class Token<T = unknown> {
  private rules: TokenRules | null = null;

  // 重载 1：T extends SmartData ⇒ 只允许传一个参数
  constructor(value: T extends SmartData ? T : never);

  // 重载 2：T 不是 SmartData ⇒ 允许传两个参数
  constructor(value: T, options: T extends SmartData ? (T extends Function ? TokenOptions : never) : TokenOptions);
  constructor(
    private value: T,
    options?: TokenOptions,
  ) {
    if (options) {
      this.rules = options.rules;
    }
  }

  public async getSchemaEntity(context: TokenContext): Promise<SchemaEntity> {
    const value = this.value;
    const rules = this.rules;

    return this.toSchemaEntity(value, rules, context);
  }

  private async toSchemaEntity(value: unknown, rules: TokenRules | null, context: TokenContext): Promise<SchemaEntity> {
    if (rules) {
      return this.iterateRules(value, rules, context);
    }

    if (typeof value === 'function') {
      return this.toSchemaCallback(value, context);
    }

    if (value instanceof Promise) {
      return value.then((value) => {
        return this.toSchemaEntity(value, rules, context);
      });
    }

    return this.toSchemaData(value);
  }

  private iterateRules(value: any, rules: TokenRule[], context: TokenContext): SchemaEntity {
    let schema: SchemaEntity = this.toStructured(value);
    schema;
    let index = 0;
    let rule = rules[index];

    while (rule) {
      const path = getDescendantPath(rule.path);
      iteratePath(schema.value, path, (value, current, key, isLast) => {
        if (isLast) {
          // 如果这是最后一个 key，则使用 rule 进行处理
          current[key] = this.parseRule(value, rule, context);
        } else {
          // 这是中间的 key，需要使用 rule 进行处理
          current[key] = this.toStructured(value);
        }
      });

      rule = rules[++index];
    }

    return schema;
  }

  private parseRule(value: any, rule: TokenRule, context: TokenContext): SchemaEntity {
    switch (rule.type) {
      case 'callback': {
        return this.toSchemaCallback(value, context);
      }

      case 'ref': {
        return this.toSchemaRef(value, context);
      }

      /**
       * 如果 rule.type 为 'array'，则将 value 当作 array 进行处理，
       * 将数组下所有元素转换为 SchemaValueData 类型，因为所有未知类型都需要当作 SchemaValueData 来处理。
       */
      case 'array': {
        return {
          type: 'array',
          value: value.map((item: any) => this.toSchemaData(item)),
        };
      }

      /**
       * 如果 rule.type 为 'map'，则将 value 当作 object 进行处理，
       * 将对象下所有元素转换为 SchemaValueData 类型，因为所有未知类型都需要当作 SchemaValueData 来处理。
       */
      case 'map': {
        return {
          type: 'map',
          value: fromEntries(entries(value).map(([k, v]) => [k, this.toSchemaData(v)])),
        };
      }
    }

    // 如果类型不匹配，返回数据类型
    return this.toSchemaData(value);
  }

  private toStructured(value: any): SchemaStructured {
    if (Array.isArray(value)) {
      return {
        type: 'array',
        value,
      };
    }

    return {
      type: 'map',
      value,
    };
  }

  private toSchemaCallback(value: Function, context: TokenContext): SchemaValueCallback {
    return {
      type: 'callback',
      source: context.name,
      ref: context.createRefId({
        type: 'callback',
        value,
      }),
    };
  }

  private toSchemaRef(value: unknown, context: TokenContext): SchemaValueRef {
    return {
      type: 'ref',
      source: context.name,
      ref: context.createRefId({
        type: 'ref',
        value,
      }),
    };
  }

  private toSchemaData(value: any): SchemaValueData {
    return {
      type: 'data',
      value,
    };
  }
}

export function isToken(value: unknown): value is Token {
  return value instanceof Token;
}
