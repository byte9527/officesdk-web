/**
 * 客户端引用参数的唯一标识
 */
export class ReferenceToken {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  public toString() {
    return this.value;
  }
}

export enum ReferenceType {
  Callback = 0,
  Value = 1,
}

/**
 * 远程调用时的引用类型参数声明
 */
export type ReferencesDeclares = [index: number, type: ReferenceType, path?: string][];

/**
 * 客户端引用参数
 */
export type ClientReference =
  | {
      type: 'value';
      value: any;
    }
  | {
      type: 'callback';
      value: (...args: any[]) => void;
    };

/**
 * 客户端用于生成引用参数的上下文
 */
export class ClientReferenceManager {
  private references: Map<string, ClientReference> = new Map();
  private index = 0;

  /**
   * 生成引用参数
   */
  public createReference(reference: ClientReference): ReferenceToken {
    const token = new ReferenceToken(`#office-sdk-rpc@${this.index++}`);
    this.references.set(token.toString(), reference);
    return token;
  }

  /**
   * 获取引用参数
   */
  public getReference(token: string): ClientReference | undefined {
    return this.references.get(token);
  }

  /**
   * 撤销引用参数
   */
  public revokeReference(token: string) {
    this.references.delete(token);
  }

  /**
   * 检查引用参数是否存在
   */
  public hasReference(token: string) {
    return this.references.has(token);
  }
}
