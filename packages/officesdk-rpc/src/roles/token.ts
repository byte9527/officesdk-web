import { fromEntries, entries } from '../shared/object';
import type { Cloneable } from '../shared/cloneable';
import type { SchemaEntity, SchemaStructured, SchemaValueCallback, SchemaValueRef, SchemaValueData } from './schema';
import { isSimpleValue } from '../shared/cloneable';
import { isPlainObject, isArray } from '../shared/type';

/**
 * 定义传入的数据通过 Token 转换为 schema 的规则，
 * 需要特殊转换后传输的数据，绝大多数都是一个对象或是函数，
 * 此时需要指定着部分需要转换的数据在 value 中的路径，
 * 举几个常规的 rule 关系：
 * value: window ==> [{ type: 'ref', path: '&' }]
 * value: { foo: document } ==> [{ type: 'ref', path: '&.foo' }]
 * value: () => {} ==> [{ type: 'callback', path: '&' }]
 * value: { foo: () => {} } ==> [{ type: 'callback', path: '&.foo' }]
 * value: [window] ==> [{ type: 'ref', path: '&[0]' }]
 * value: { foo: [window] } ==> [{ type: 'ref', path: '&.foo[0]' }]
 */

export type TokenRulePath = `&${string}`;

export type TokenRulePaths = [TokenRulePath, ...TokenRulePath[]];

export type TokenRule = {
  type: 'callback' | 'ref' | 'array' | 'map';
  paths: TokenRulePaths;
};

function getDescendantPath(path: TokenRulePath): string {
  return path.slice(1);
}

/**
 * 初始化 Token 的配置
 */
export interface TokenOptions {
  arrays?: TokenRulePaths;
  maps?: TokenRulePaths;
  callbacks?: TokenRulePaths;
  refs?: TokenRulePaths;
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

const TokenStructuredSymbol = Symbol('TokenStructured');

type TokenStructured = {
  [TokenStructuredSymbol]: true;
} & SchemaStructured;

function createTokenStructured(value: SchemaStructured): TokenStructured {
  return {
    [TokenStructuredSymbol]: true,
    ...value,
  };
}

function isTokenStructured(value: unknown): value is TokenStructured {
  return typeof value === 'object' && Object.getOwnPropertyDescriptor(value, TokenStructuredSymbol)?.value == true;
}

const TokenValueSymbol = Symbol('TokenData');

type TokenValue = {
  [TokenValueSymbol]: true;
} & SchemaValueData;

function createTokenValue(value: SchemaValueData): TokenValue {
  return {
    [TokenValueSymbol]: true,
    ...value,
  };
}

function isTokenValue(value: unknown): value is TokenValue {
  return typeof value === 'object' && Object.getOwnPropertyDescriptor(value, TokenValueSymbol)?.value == true;
}

/**
 * Token 的主要作用是将无法跨环境传输的数据封装为可以跨环境传输的数据或引用参数，
 * 理论上可以将任意数据封装为 Token，但封装为引用类型的数据只能跨环境作为参数引用，不能在其他环境中直接使用。
 */
export class Token {
  private options: TokenOptions = {};

  constructor(
    private value: unknown,
    options?: TokenOptions,
  ) {
    if (options) {
      this.options = options;
    }
  }

  public async getSchemaEntity(context: TokenContext): Promise<SchemaEntity> {
    const value = this.value;
    const rules = this.sortRules();

    return this.toSchemaEntity(value, rules, context);
  }

  private sortRules(): TokenRule[] {
    const { callbacks, refs, arrays, maps } = this.options;

    const rules: TokenRule[] = [];
    if (callbacks?.length) {
      rules.push({
        type: 'callback',
        paths: callbacks,
      });
    }

    if (refs?.length) {
      rules.push({
        type: 'ref',
        paths: refs,
      });
    }

    if (maps?.length) {
      rules.push({
        type: 'map',
        paths: maps,
      });
    }

    if (arrays?.length) {
      rules.push({
        type: 'array',
        paths: arrays,
      });
    }

    return rules;
  }

  private async toSchemaEntity(
    value: unknown,
    rules: TokenRule[] | null,
    context: TokenContext,
  ): Promise<SchemaEntity> {
    // 如果定义了规则，优先使用规则进行转换
    if (rules?.length) {
      return this.iterateRules(value, rules, context);
    }

    // 如果是函数直接转为 callback
    if (typeof value === 'function') {
      return this.toSchemaCallback(value, context);
    }

    // 如果是 Promise 则等待异步完成后再递归调用
    if (value instanceof Promise) {
      return value.then((value) => {
        return this.toSchemaEntity(value, rules, context);
      });
    }

    // 如果是安全可直接传输的值，则直接返回
    if (isSimpleValue(value)) {
      return this.toSchemaData(value);
    }

    // 如果是纯对象或数组，深度遍历对象
    if (isPlainObject(value) || isArray(value)) {
      return this.iterateValue(value, context);
    }

    // 其他未知类型全部转为 ref
    return this.toSchemaRef(value, context);
  }

  /**
   * 自动进行类型转换，流程如下：
   * 1. 深度递归遍历的 value 中所有属性
   * 2. 如果 value 是及其下面所有属性都可以通过 structuredClone 传输，则调用 .toSchemaData 转换
   * 3. 如果 value 中存在一些无法通过 structuredClone 传输的属性，则调用 .toSchemaRef 或 .toSchemaCallback 转换
   * @param value
   * @param context
   * @returns
   */
  private async iterateValue(value: Record<string, unknown> | unknown[], context: TokenContext): Promise<SchemaEntity> {
    // 检查是否所有属性都可以通过 structuredClone 传输
    if (this.isStructuredCloneable(value)) {
      // 如果所有属性都可以通过 structuredClone 传输，直接转换为 SchemaData
      return this.toSchemaData(value);
    }

    // 否则递归处理每个属性
    if (Array.isArray(value)) {
      const result: SchemaStructured = {
        type: 'array',
        value: [],
      };

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        // 递归处理数组中的每个元素
        result.value.push(await this.toSchemaEntity(item, null, context));
      }

      return createTokenStructured(result);
    } else {
      const result: SchemaStructured = {
        type: 'map',
        value: {},
      };

      for (const [key, item] of entries(value)) {
        // 递归处理对象中的每个属性
        result.value[key] = await this.toSchemaEntity(item, null, context);
      }

      return createTokenStructured(result);
    }
  }

  /**
   * 递归检查值及其所有属性是否都可以通过 structuredClone 传输
   * @param value 要检查的值
   * @returns 如果值及其所有属性都可以通过 structuredClone 传输，则返回 true
   */
  private isStructuredCloneable(value: unknown): boolean {
    // 原始值可以直接传输
    if (isSimpleValue(value)) {
      return true;
    }

    // 函数、Promise 等不能通过 structuredClone 传输
    if (typeof value === 'function' || value instanceof Promise) {
      return false;
    }

    // 非普通对象不能通过 structuredClone 传输
    if (!isPlainObject(value) && !isArray(value)) {
      return false;
    }

    // 递归检查数组的每个元素
    if (isArray(value)) {
      return value.every((item) => this.isStructuredCloneable(item));
    }

    // 递归检查对象的每个属性
    if (isPlainObject(value)) {
      return Object.values(value).every((item) => this.isStructuredCloneable(item));
    }

    return false;
  }

  private iterateRules(value: any, rules: TokenRule[], context: TokenContext): SchemaEntity {
    let schema: SchemaEntity = this.toStructured(value);
    schema;
    let index = 0;
    let rule = rules[index];

    while (rule) {
      const { type, paths } = rule;

      for (const path of paths) {
        const descendantPath = getDescendantPath(path);
        iteratePath(schema, descendantPath, (object, key, isLast) => {
          if (isLast) {
            const current = object.value;
            const value = current[key];

            // 如果这是最后一个 key，则使用 rule 进行处理，
            // 这里拿到的 value 是一个 SchemaValueData，因为这个 value 之前应该在上层被 toStructured 了
            const data = isTokenValue(value) ? value.value : value;
            current[key] = this.parseRule(data, type, context);
          } else {
            // 这是中间的 key，需要转为结构化数据，
            if (isTokenStructured(object)) {
              // @ts-expect-error
              const structured = this.toStructured(object.value[key]);
              // @ts-expect-error
              object.value[key] = structured;
              return structured;
            } else {
              const structured = this.toStructured(object[key]);
              object[key] = structured;

              return structured;
            }
          }
        });
      }

      rule = rules[++index];
    }
    return schema;
  }

  private parseRule(value: any, type: TokenRule['type'], context: TokenContext): SchemaEntity {
    switch (type) {
      case 'callback': {
        return this.toSchemaCallback(value, context);
      }

      case 'ref': {
        return this.toSchemaRef(value, context);
      }

      /**
       * 如果 rule.type 为 'array' 或 'map，则将 value 转换为结构化数据。
       */
      case 'map': {
        return this.toStructured(value, 'map');
      }
      case 'array': {
        return this.toStructured(value, 'array');
      }
    }

    // 如果类型不匹配，返回数据类型
    return this.toSchemaData(value);
  }

  private toStructured(value: any, type?: 'map' | 'array'): TokenStructured {
    if (isTokenStructured(value)) {
      return value;
    }

    if (isTokenValue(value)) {
      return this.toStructured(value.value);
    }

    if (Array.isArray(value) || type === 'array') {
      return createTokenStructured({
        type: 'array',
        value: value.map((item: any) => this.toSchemaData(item)),
      });
    }

    return createTokenStructured({
      type: 'map',
      value: fromEntries(entries(value).map(([k, v]) => [k, this.toSchemaData(v)])),
    });
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
    if (isTokenValue(value)) {
      return value;
    }

    return createTokenValue({
      type: 'data',
      value,
    });
  }
}

export function isToken(value: unknown): value is Token {
  return value instanceof Token;
}

function iteratePath(obj: any, path: string, callback: (object: any, key: string, isLast: boolean) => any): void {
  let current = obj;

  if (!path) {
    return;
  }

  const keys = path.split('.');

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    current = callback(current, key, i === keys.length - 1);
  }
}
