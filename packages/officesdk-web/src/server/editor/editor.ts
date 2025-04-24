import type { EditorContent } from '../../shared';

/**
 * 编辑器上下文，包括除编辑器实例外的其他信息
 */
export interface EditorContext {
  /**
   * 编辑器内容接口
   */
  content?: EditorContent;
}
