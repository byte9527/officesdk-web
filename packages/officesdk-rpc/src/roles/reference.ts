/**
 * 客户端引用参数的唯一标识
 */
export type ReferenceToken = {
  value: string;
};

export enum ReferenceType {
  Callback = 0,
  Object = 1,
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
      type: 'object';
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
    const name = `#office-sdk-rpc@${this.index++}`;

    this.references.set(name, reference);
    return {
      value: name,
    };
  }

  /**
   * 获取引用参数
   */
  public getReference(name: string): ClientReference | undefined {
    return this.references.get(name);
  }

  /**
   * 撤销引用参数
   */
  public revokeReference(name: string) {
    this.references.delete(name);
  }

  /**
   * 检查引用参数是否存在
   */
  public hasReference(name: string) {
    return this.references.has(name);
  }
}
