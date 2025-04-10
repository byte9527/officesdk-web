export type ConnectionReferences = [index: number, type: 'callback' | 'value', path?: string][];

/**
 * 客户端引用参数的唯一标识
 */
export class ClientReferenceToken {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public toString() {
    return this.token;
  }
}

/**
 * 客户端引用参数
 */
export interface ClientReference<T> {
  type: 'callback' | 'value';
  value: T;
}

/**
 * 客户端用于生成引用参数的上下文
 */
export class ClientReferenceContext {
  private references: Map<ClientReferenceToken, ClientReference<any>> = new Map();
  private index = 0;

  /**
   * 生成引用参数
   */
  public createReference(type: 'callback' | 'value', value: unknown): ClientReferenceToken {
    const token = new ClientReferenceToken(`@${this.index++}`);
    this.references.set(token, { type, value });
    return token;
  }

  /**
   * 获取引用参数
   */
  public getReference<T>(reference: ClientReferenceToken): ClientReference<T> | undefined {
    return this.references.get(reference);
  }

  /**
   * 撤销引用参数
   */
  public revokeReference(reference: ClientReferenceToken) {
    this.references.delete(reference);
  }

  /**
   * 检查引用参数是否存在
   */
  public hasReference(reference: ClientReferenceToken) {
    return this.references.has(reference);
  }
}

/**
 * 服务端用于处理引用类型的代码，
 * 将客户端的引用类型参数转换为可在服务端使用的值
 */
export class ServerReferenceProxy {
  private references: Map<ClientReferenceToken, ClientReference<any>> = new Map();

  public parse(reference: ClientReferenceToken) {
    return this.references.get(reference);
  }
}
