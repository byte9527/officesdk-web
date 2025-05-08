/**
 *  抽象 Diagram 接口
 */
export declare abstract class AbstractedDiagramSDK {
    protected options: DiagramSDKOptions;
    constructor(options: DiagramSDKOptions);
    /**
     * 初始化 Diagram 、加载插件等操作。
     */
    abstract init(): Promise<void>;
    /**
     * 销毁 Diagram
     */
    abstract destroy(): Promise<void>;
    /**
     * 将 Diagram 挂载到指定的根节点上，并渲染，
     * mount 应该在 init 之后调用。
     * @param root
     */
    abstract mount(root: HTMLElement): Promise<void>;
    /**
     * 从根节点卸载 Diagram ，对应 /dev/sdb1 on / type ext4 (rw,relatime,discard,errors=remount-ro,commit=30)
devtmpfs on /dev type devtmpfs (rw,nosuid,noexec,relatime,size=8184096k,nr_inodes=2046024,mode=755,inode64)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev,inode64)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,nodev,size=3274692k,nr_inodes=819200,mode=755,inode64)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k,inode64)
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
bpf on /sys/fs/bpf type bpf (rw,nosuid,nodev,noexec,relatime,mode=700)
systemd-1 on /proc/sys/fs/binfmt_misc type autofs (rw,relatime,fd=32,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=1905)
hugetlbfs on /dev/hugepages type hugetlbfs (rw,nosuid,nodev,relatime,pagesize=2M)
mqueue on /dev/mqueue type mqueue (rw,nosuid,nodev,noexec,relatime)
debugfs on /sys/kernel/debug type debugfs (rw,nosuid,nodev,noexec,relatime)
tracefs on /sys/kernel/tracing type tracefs (rw,nosuid,nodev,noexec,relatime)
fusectl on /sys/fs/fuse/connections type fusectl (rw,nosuid,nodev,noexec,relatime)
configfs on /sys/kernel/config type configfs (rw,nosuid,nodev,noexec,relatime)
/dev/sdb16 on /boot type ext4 (rw,relatime,discard)
/dev/sdb15 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
binfmt_misc on /proc/sys/fs/binfmt_misc type binfmt_misc (rw,nosuid,nodev,noexec,relatime)
/dev/sda1 on /mnt type ext4 (rw,relatime,x-systemd.after=cloud-init.service,_netdev)
tmpfs on /run/user/1001 type tmpfs (rw,nosuid,nodev,relatime,size=1637344k,nr_inodes=409336,mode=700,uid=1001,gid=118,inode64) 操作
     */
    abstract unmount(): Promise<void>;
}

export declare abstract class AbstractedDocxSDK extends EditorSDK {
    /**
     * 打印文档
     */
    abstract print(): Promise<void>;
    /**
     * 跳转到某个位置
     */
    abstract goto(options: DocxGotoOptions): boolean;
    /**
     * 文档缩放接口
     * @param scale
     */
    /**
     * 文档目录集合接口，
     * 一个文档中可以存在多个目录，这个接口是用来管理文档中的所有目录的。
     */
    abstract get TOCs(): DocxTOCs;
    /**
     * 传统文档缩放接口
     */
    abstract get zoom(): DocxZoom;
    /**
     * 传统文档目录大纲接口
     */
    abstract get outline(): DocxOutline;
    /**
     * 文档选区接口
     */
    abstract get selection(): DocxSelection;
    /**
     * 文本格式接口
     */
    abstract get text(): DocxText;
    /**
     * 文档窗口接口
     */
    abstract get window(): DocxWindow;
    /**
     * 水印接口
     */
    abstract get watermark(): DocxWatermark;
    /**
     * 搜索接口
     */
    abstract get search(): DocxSearch;
}

/**
 *  抽象 Pdf 接口
 */
export declare abstract class AbstractedPdfSDK {
    protected options: PdfSDKOptions;
    constructor(options: PdfSDKOptions);
    /**
     * 初始化 Pdf 、加载插件等操作。
     */
    abstract init(): Promise<void>;
    /**
     * 销毁 Pdf
     */
    abstract destroy(): Promise<void>;
    /**
     * 将 Pdf 挂载到指定的根节点上，并渲染，
     * mount 应该在 init 之后调用。
     * @param root
     */
    abstract mount(root: HTMLElement): Promise<void>;
    /**
     * 从根节点卸载 pdf ，对应 /dev/sdb1 on / type ext4 (rw,relatime,discard,errors=remount-ro,commit=30)
devtmpfs on /dev type devtmpfs (rw,nosuid,noexec,relatime,size=8184096k,nr_inodes=2046024,mode=755,inode64)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev,inode64)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,nodev,size=3274692k,nr_inodes=819200,mode=755,inode64)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k,inode64)
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
bpf on /sys/fs/bpf type bpf (rw,nosuid,nodev,noexec,relatime,mode=700)
systemd-1 on /proc/sys/fs/binfmt_misc type autofs (rw,relatime,fd=32,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=1905)
hugetlbfs on /dev/hugepages type hugetlbfs (rw,nosuid,nodev,relatime,pagesize=2M)
mqueue on /dev/mqueue type mqueue (rw,nosuid,nodev,noexec,relatime)
debugfs on /sys/kernel/debug type debugfs (rw,nosuid,nodev,noexec,relatime)
tracefs on /sys/kernel/tracing type tracefs (rw,nosuid,nodev,noexec,relatime)
fusectl on /sys/fs/fuse/connections type fusectl (rw,nosuid,nodev,noexec,relatime)
configfs on /sys/kernel/config type configfs (rw,nosuid,nodev,noexec,relatime)
/dev/sdb16 on /boot type ext4 (rw,relatime,discard)
/dev/sdb15 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
binfmt_misc on /proc/sys/fs/binfmt_misc type binfmt_misc (rw,nosuid,nodev,noexec,relatime)
/dev/sda1 on /mnt type ext4 (rw,relatime,x-systemd.after=cloud-init.service,_netdev)
tmpfs on /run/user/1001 type tmpfs (rw,nosuid,nodev,relatime,size=1637344k,nr_inodes=409336,mode=700,uid=1001,gid=118,inode64) 操作
     */
    abstract unmount(): Promise<void>;
    /**
     * pdf 页面操作接口
     */
    abstract get pages(): PdfPages;
    /**
     * pdf 选区接口
     */
    abstract get selection(): PdfSelection;
    /**
     * pdf 目录接口
     */
    abstract get outline(): PdfOutline;
}

export declare abstract class AbstractedPresentationSDK extends EditorSDK {
    /**
     * 打印幻灯片
     */
    abstract print(): Promise<void>;
    /**
     * 幻灯片集合接口
     */
    abstract get slides(): PresentationSlides;
    /**
     * 幻灯片选区接口，用于获取、操作当前 slide 的选区
     */
    abstract get selection(): PresentationSelection;
    /**
     * 幻灯片缩放接口
     * @param scale
     */
    abstract get zoom(): PresentationZoom;
    /**
     * 文本格式接口
     */
    abstract get text(): PresentationText;
}

export declare abstract class AbstractedSheetSDK extends EditorSDK {
    /**
     * 打印文档
     */
    abstract print(): Promise<void>;
    /**
     * 工作簿接口
     */
    abstract get workbook(): SheetWorkbook;
    /**
     * 当前活跃工作表对象
     */
    abstract get activeSheet(): SheetWorksheet;
    /**
     * 当前活动单元格
     */
    abstract get activeCell(): SheetCell | null;
    /**
     * 获取当前选区
     */
    abstract get selections(): SheetSelection[] | null;
    /**
     * 文本格式接口
     */
    abstract get text(): SheetText;
}

/**
 *  Diagram 初始化参数
 */
export declare interface DiagramSDKOptions {
    /**
     *  Diagram 初始化内容，可以是 string 或者 ArrayBuffer，
     * 也可以通过异步 Promise 加载
     */
    content: MaybePromiseValue<string | ArrayBuffer>;
    /**
     * 当前操作 Diagram 的用户信息
     */
    user?: EditorUserOptions;
    /**
     * i18n 相关设置
     */
    i18n?: EditorI18nOptions;
    /**
     * 品牌相关设置
     */
    brand?: EditorBrandOptions;
    /**
     *  Diagram 内部资源请求配置
     */
    assets?: EditorAssetsOptions;
    /**
     *  Diagram 内部超链接设置
     */
    link?: EditorLinkOptions;
    /**
     * 初始化水印配置
     */
    watermark?: EditorWatermarkOptions;
    /**
     *  Diagram 打印设置
     */
    print?: EditorPrintOptions;
}

export declare type DocxFontFace = Omit<EditorFontFace, 'meta'> & {
    meta: DocxFontMeta;
};

export declare interface DocxFontMeta {
    /**
     * 用于计算排版信息的字体数据
     */
    textMetrics: {
        /**
         * 字体的每个 Em 单位所对应的单位数 (Em 单位是字体排版中的基本单位)。
         * 通常用于将字体设计的相对大小映射为实际大小。
         * 例如，单位是 1000 或 2048，具体取决于字体的定义。
         */
        unitsPerEm: number;
        /**
         * 上升线（Ascender）的值，以 Em 单位为基准。
         * 表示从基线到字体最高可见字符顶部的距离（例如字母“d”顶部）。
         */
        ascender: number;
        /**
         * 下降线（Descender）的值，以 Em 单位为基准。
         * 表示从基线到字体最低可见字符底部的距离（例如字母“p”尾部）。
         * 通常为负值。
         */
        descender: number;
        /**
         * 行间距（Line Gap），以 Em 单位为基准。
         * 表示字体推荐的额外间距，用于在不同的行之间添加额外的垂直空间。
         */
        lineGap: number;
        /**
         * 这个参数属于文档排版信息中的 magic number，只能通过逆向工程推导出来，无法通过字体文件直接获取，
         * 该值仅影响中文在传统文档中的精确度，默认情况下也可以缺省，可以简单认为在中文环境下该值为 1.3 附近，该值不准确会产品文档排版信息的累计误差，其他套件影响不大。
         * 中文常用字体的信息包含在传统文档 packages/core-editor/src/fonts 的目录中，不需要额外配置。
         * 新增的非常规中文字体可以设置为 1.3.
         */
        extendScale?: number;
    };
    /**
     * ulCodePageRange 用于指示字体支持哪些代码页的位域（bit field）。代码页是字符编码的定义，指定了如何将字符映射到数字值。
     * 主要是用来判断字体包含的所有字符的范围。
     * 技术细节
     * •	位置：ulCodePageRange 位于字体文件的 OS/2 表中。
     * •	定义：每个位的定义详见 Microsoft OpenType 规范的 OS/2 表文档。
     * •	位分配示例：
     * •	第 0 位：Latin 1 (1252)
     * •	第 1 位：Latin 2: Eastern Europe (1250)
     * •	第 2 位：Cyrillic (1251)
     * •  第 6 位：Arabic (1256)
     * •	第 17 位：Japanese: Shift-JIS
     * •	第 18 位：Chinese: Simplified chars—PRC and Singapore (936)
     * •	第 19 位：Korean Wansung
     * •	第 20 位：Chinese Traditional: Big5 (950)
     * 参考链接：http://learn.microsoft.com/en-us/typography/opentype/spec/os2#cpr
     */
    ulCodePageRange: [number, number];
    /**
     * 用于文档字体的name以及family的匹配
     */
    name?: EditorFontMeta['name'];
}

export declare interface DocxFontsList {
    getAll: () => Promise<DocxFontFace[]>;
}

export declare interface DocxFontsOptions {
    list: DocxFontsList;
}

export declare type DocxGotoOptions = {
    /**
     * 区域，跳转到对应区域位置
     */
    type: 'range';
    /**
     * 区域值，这个值可以通过 DocxSelection 的 getRange 方法拿到
     */
    range: string;
} | {
    /**
     * 页码，跳转到对应页码位置
     */
    type: 'page';
    /**
     * 页码
     */
    page: number;
} | {
    /**
     * 顶部，跳转到文档顶部
     */
    type: 'top';
} | {
    /**
     * 跳转到某个评论
     */
    type: 'comment';
    /**
     * 评论 ID
     */
    commentId: string;
};

/**
 * 图片水印属性值
 */
export declare interface DocxImageWatermark {
    /**
     * 图片地址或base64数据
     */
    image: string;
    /**
     * 图片宽度，如: '100px'
     */
    width: string;
    /**
     * 图片高度，如: '100px'
     */
    height: string;
}

/**
 * 文档信息配置项，用于显示在文档信息弹窗中的内容
 */
export declare interface DocxInfoOptions {
    views?: {
        count?: number;
    };
    created?: {
        time?: number;
        author?: string;
    };
}

/**
 * 传统文档工具栏一级菜单
 */
export declare type DocxMenuEntryConfig = EditorMenuEntryConfig<DocxMenuFeatureButtonName>;

/**
 * 传统文档工具栏功能按钮
 */
export declare type DocxMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<DocxMenuFeatureButtonName>;

/**
 * 传统文档工具栏内置功能按钮
 */
export declare type DocxMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'export' | 'saveTemplate' | 'viewHistory' | 'saveHistory' | 'attachment' | 'cloudFile' | 'signature' | 'image';

export declare type DocxMenuOptions = EditorMenuOptions<DocxMenuFeatureButtonName>;

/**
 * 传统文档目录大纲项接口
 */
export declare type DocxOutline = EditorOutline<{
    text: string;
}>;

/**
 * 传统文档目录大纲项信息，用于描述传统文档中的目录项信息。
 */
export declare type DocxOutlineItem = EditorOutlineItem<{
    text: string;
}>;

export declare type DocxOutlineOptions = EditorOutlineOptions;

/**
 * 区域（Range）
 * 区域对象，表示文档中的一个连续区域，每个 Range 对象包含起始字符位置和终止字符位置。
 */
/**
 * 文档区域对象，
 * 用于表示文档中的一个连续区域，
 * 每个选区值包含了起始位置和结束位置信息的字符串。
 */
export declare interface DocxRange {
    /**
     * 区域的开始位置，
     * 当文档发生变化后，区域的标识可能会失效。
     */
    readonly start: string;
    /**
     * 区域的结束位置，
     * 当文档发生变化后，区域的标识可能会失效。
     */
    readonly end: string;
    /**
     * 是否为光标。
     */
    readonly isCaret: boolean;
    /**
     * 获取该区域对应的纯文本信息。
     * @returns
     */
    getText: () => string;
    /**
     * 将区域中的内容以 HTML 格式返回。
     * @returns
     */
    getHtml: () => string;
    /**
     * 将区域内的文本设置为指定的文本，
     * 如果文本为空，则清空区域内的文本。
     * 如果区域为
     * @param text
     */
    setText: (text: string) => void;
    /**
     * 将区域内的文本设置为指定的 HTML 内容，
     * 如果内容为空，则清空区域内的内容。
     * 如果区域为光标，则会将光标位置的文本替换为指定的 HTML 格式。
     * @param html
     */
    setHtml: (html: string) => void;
    /**
     * 获取选区在当前屏幕上的位置信息
     * @returns
     */
    getBounding: () => DocxRangeBounding | null;
}

/**
 * 记录区域在屏幕上的位置信息，
 * 包含了区域的四个边界值，以及开始和结束位置。
 * 因为选区是由多个矩形区域组成的，
 * 所以这里的位置信息是一个矩形区域的边界值。
 */
export declare interface DocxRangeBounding {
    /**
     * 区域的左边界值，
     * 代表区域的最左边的 X 坐标，
     * 也就是区域的最左边的矩形区域的左边界值。
     */
    top: number;
    /**
     * 区域的上边界值，
     * 代表区域的最上边的 Y 坐标，
     * 也就是区域的最上边的矩形区域的上边界值。
     */
    right: number;
    /**
     * 区域的右边界值，
     * 代表区域的最右边的 X 坐标，
     * 也就是区域的最右边的矩形区域的右边界值。
     */
    bottom: number;
    /**
     * 区域的下边界值，
     * 代表区域的最下边的 Y 坐标，
     * 也就是区域的最下边的矩形区域的下边界值。
     */
    left: number;
    /**
     * 第一行的开始 X 坐标，
     */
    start: number;
    /**
     * 最后一行的结束 X 坐标，
     */
    end: number;
}

/**
 * 区域值，
 * 包含了区域的开始位置和结束位置。
 */
export declare interface DocxRangeValue {
    /**
     * 开始位置
     */
    start: string;
    /**
     * 结束位置
     */
    end: string;
}

/**
 * 替换回调，因为替换可能是异步分批执行的，所以需要通过回调来返回结果，可能会调用多次回调，
 * 如果所有替换都结束，则 abort 为 undefined，如果替换没有结束，则 abort 为终止替换的函数
 */
export declare type DocxReplaceCallback = (result: DocxSearchResult, abort?: () => void) => void;

export declare interface DocxReplaceParams {
    /**
     * 需要替换的内容
     */
    value: string;
}

export declare interface DocxReplaceResult {
    /**
     * 被替换的查找结果
     */
    id: string;
    /**
     * 替换前的内容
     */
    oldValue: string;
}

export declare interface DocxSDKOptions extends EditorOptions {
    /**
     * 文档信息配置
     */
    info?: DocxInfoOptions;
    /**
     * 字体配置
     */
    fonts?: DocxFontsOptions;
    /**
     * 菜单栏相关设置
     */
    menu?: DocxMenuOptions;
    /**
     *  Pdf 大纲目录设置
     */
    outline?: DocxOutlineOptions;
    /**
     * 文本格式相关设置
     */
    text?: DocxTextOptions;
    /**
     * 水印相关配置
     */
    watermark?: DocxWatermarkOptions;
    /**
     * 主题字体相关配置
     */
    theme?: DocxThemeOptions;
}

/**
 * 查找、替换接口
 */
export declare interface DocxSearch {
    /**
     * 查找
     * @param params 查找选项
     */
    findOne: (params: DocxSearchParams) => Promise<DocxSearchResult | null>;
    /**
     * 查找所有，
     * 由于查找所有可能需要查找很长时间，所以需要通过回调来返回结果，可能会调用多次回调
     * @param params 查找选项
     * @param callback 回调
     */
    findAll: (params: DocxSearchParams, callback: DocxSearchCallback) => void;
    /**
     * 替换
     * @param id 匹配结果的标识
     * @param params 查找选项
     */
    replaceOne: (id: string, params: DocxReplaceParams) => Promise<DocxReplaceResult | null>;
    /**
     * 替换所有
     * @param params 替换选项
     * @param callback 回调
     */
    replaceAll: (params: DocxReplaceParams, callback: DocxReplaceCallback) => void;
    /**
     * 清空当前搜索结果，并中断当前未完成的搜索操作
     * @returns
     */
    clear: () => void;
}

/**
 * 查找回调，因为查找、替换可能是异步分批执行的，所以需要通过回调来返回结果，可能会调用多次回调，
 * 如果所有查找都结束，则 abort 为 undefined，如果查找没有结束，则 abort 为终止查找的函数
 */
export declare type DocxSearchCallback = (results: DocxSearchResult[], abort?: () => void) => void;

export declare interface DocxSearchParams {
    /**
     * 需要查找的内容
     */
    content: string;
    /**
     * 是否需要高亮，默认高亮，
     * 如果设置为 false，则不会高亮匹配内容，只会返回匹配内容，可以用作无感搜索
     */
    highlight?: boolean;
}

export declare interface DocxSearchResult {
    /**
     * 匹配内容
     */
    content: string;
    /**
     * 用于搜索的关键字
     */
    keyword: string;
    /**
     * 匹配范围
     */
    range: DocxRangeValue;
    /**
     * 查找结果的唯一标识
     */
    id: string;
}

/**
 * 选区（Selection）
 * 表示窗口中的当前选定内容。
 * 选定内容表示文档中的选定（或突出显示）区域，或者代表插入点（如果未选择文档中的任何内容）。
 */
export declare interface DocxSelection {
    /**
     * 获取选区的区域范围，
     * 如果没有指定范围，则返回当前选区的范围。
     * 如果指定了范围，则返回指定范围的选区。
     * 如果选区不存在，则返回 null。
     * @returns
     */
    getRange: (value?: DocxRangeValue) => DocxRange | null;
    /**
     * 设置选区的区域范围，
     * 设置后，选区会自动选中指定范围。
     * 如果设置为 null，则清空选区。
     * 注意：设置取消之前需要确认该选区是否属于当前页面。
     * @param value
     */
    setRange: (value: DocxRangeValue | null) => void;
    /**
     * 添加选区变化监听器，当选区发生变化时，会触发回调。
     * @param listener
     * @returns
     */
    addRangeListener: (listener: (value: DocxRangeValue | null) => void) => void;
}

/**
 * 传统文档文本接口
 */
export declare type DocxText = EditorText<string, DocxRangeValue>;

/**
 * 传统文档文本格式
 */
export declare type DocxTextFormat = EditorTextFormat;

/**
 * 传统文档文本格式初始化选项
 */
export declare type DocxTextOptions = EditorTextOptions<string>;

/**
 * 文本水印属性值
 */
export declare interface DocxTextWatermark {
    /**
     * 水印文本内容
     */
    text: string;
    /**
     * 字体名称
     */
    font: string;
    /**
     * 是否加粗
     */
    bold: boolean;
    /**
     * 是否斜体
     */
    italic: boolean;
    /**
     * 文本颜色，如: '#000000'
     */
    color: string;
    /**
     * 文本大小，如: '12pt'
     */
    size: string;
}

export declare interface DocxThemeFont {
    typeface: string;
}

/**
 * 主题字体配置
 */
export declare interface DocxThemeFontsScheme {
    /**
     * 标题字体
     */
    major: DocxThemeFontsSchemeItem;
    /**
     * 正文字体
     */
    minor: DocxThemeFontsSchemeItem;
}

/**
 * 主题字体Scheme配置
 */
export declare interface DocxThemeFontsSchemeItem {
    /**
     * 西文字体
     */
    latin: DocxThemeFont;
    /**
     * 东亚字体
     */
    ea: DocxThemeFont;
    /**
     * 复杂文字字体
     */
    cs: DocxThemeFont;
    /**
     * 其他单独字体配置
     * key 表示script值
     * 例如：
     * <a:font script=Hans typeface=黑体/>
     * <a:font script=Jpan typeface=HG明朝B/>
     * <a:font script=Arab typeface=Times New Roman/>
     */
    font: Record<string, DocxThemeFont>;
}

/**
 * 主题配置
 */
export declare interface DocxThemeOptions {
    /**
     * 主题字体配置
     * 这里的主题是兜底的默认配置，在文档自己的字体配置和全局的字体配置都没有的时候才会使用这里的配置
     */
    fonts?: DocxThemeFontsScheme;
    /**
     * 界面功能设置
     */
    preferences?: {
        /**
         * 默认主题字体
         */
        fonts?: {
            /**
             * 禁用全局主题字体设置功能
             */
            disabled?: boolean;
            /**
             * 设置默认主题字体的方法
             * @param data 数据源
             * @param id 文档唯一标识，不传则设置为全局配置。注意在实现时要结合disabled.global来判断是否能够设置全局配置
             * @returns 是否设置成功
             */
            set?: (data: DocxThemeFontsScheme, id?: string) => Promise<boolean>;
            /**
             * 获取主题字体数据的方法
             * @param id 文档唯一标识，不传则获取全局配置
             * @returns 数据源，如果没有则返回null
             */
            get?: (id?: string) => Promise<DocxThemeFontsScheme | null>;
        };
    };
}

/**
 * 通用目录项条目
 */
export declare interface DocxTocContentItem {
    /**
     * 目录项 ID
     */
    id: string;
    /**
     * 目录项层级
     */
    level: number;
    /**
     * 目录项内容
     */
    content: {
        /**
         * 目录项内容
         */
        text: string;
    };
}

/**
 * 传统文档目录操作接口，
 * 可以调用接口更新目录和页码，
 * 也可以设置目录级别、页码等样式。
 */
export declare interface DocxTocItem {
    /**
     * 获取目录信息
     * @returns 目录信息
     */
    getContent: () => Promise<DocxTocContentItem[]>;
    /**
     * 添加目录信息改变时的监听器
     * @param listener 监听器
     * @returns 取消监听器的函数
     */
    addContentChangedListener: (listener: (content: DocxTocContentItem[]) => void) => () => void;
    /**
     * 跳转到指定条目对应的正文位置
     * @param id 条目id
     * @returns 跳转是否成功
     */
    goto: (id: string) => Promise<boolean>;
    /**
     * 更新整个目录
     * @returns 是否更新成功
     */
    update: () => Promise<boolean>;
    /**
     * 仅更新页码
     * @returns 是否更新成功
     */
    updatePageNumbers: () => Promise<boolean>;
    /**
     * 设置目录层级
     * @param level 目录层级
     * @returns 是否设置成功
     */
    setLevel: (level: number) => Promise<boolean>;
}

/**
 * 传统文档目录接口，
 * 表示文档中的所有目录，
 * 需要注意的是，DocxTOCs 和 DocxTocItem 是两个不同的对象，前者代表代表目录集合（一个文档可以插入多个目录），后者单个目录。
 */
export declare interface DocxTOCs {
    /**
     * 获取所有目录列表
     * @returns 目录列表
     */
    getAll: () => Promise<DocxTocItem[]>;
    /**
     * 获取某个目录
     * @param index 目录索引
     * @returns 目录
     */
    getOne: (index: number) => Promise<DocxTocItem | null>;
    /**
     * 删除所有目录
     * @returns 删除结果
     */
    deleteAll: () => Promise<boolean>;
    /**
     * 删除某个目录
     * @param index
     * @returns 删除结果
     */
    deleteOne: (index: number) => Promise<boolean>;
    /**
     * 添加目录
     * @param options 目录选项
     * @returns 添加结果
     */
    add: (options: {
        /**
         * 添加目录的位置，
         * 默认为当前选区位置。
         * 如果添加失败，如：当前选区信息不正确，会返回 false。
         * 如果添加成功，会返回 true。
         */
        range?: string;
    }) => Promise<boolean>;
}

/**
 * 文本水印操作接口，
 * 水印属于文档的一种特殊业务，水印是 OOXML 是形状的一种业务形态封装，
 * 这里的 getAll 方法等可能不准确。
 */
export declare interface DocxWatermark {
    /**
     * 获取所有水印项目
     * @returns 水印项目数组
     */
    getAll: () => Promise<DocxWatermarkItem[]>;
    /**
     * 根据ID获取特定水印项目
     * @param id - 水印ID
     * @returns 水印项目或null
     */
    getOne: (id: string) => Promise<DocxWatermarkItem | null>;
    /**
     * 添加一个水印项目
     * @param item - 水印项目
     * @returns 新创建的水印ID
     */
    addOne: (item: DocxWatermarkItem) => Promise<string>;
    /**
     * 删除指定ID的水印项目，返回是否删除成功
     */
    deleteOne: (id: string) => Promise<boolean>;
    /**
     * @param id - 水印ID
     * @param value - 文本水印属性值
     * @returns 是否更新成功
     */
    updateText: (id: string, value: DocxTextWatermark) => Promise<boolean>;
    /**
     * @param id - 水印ID
     * @param value - 图片水印属性值
     * @returns 是否更新成功
     */
    updateImage: (id: string, value: DocxImageWatermark) => Promise<boolean>;
    /**
     * 删除所有水印项目
     * @returns 被删除的水印ID数组
     */
    deleteAll: () => Promise<string[]>;
    /**
     * 设置水印
     * TODO: 设置水印到某个节 section 上，目前只支持设置到整个文档上
     * @param id - 水印ID
     * @returns 是否设置成功
     */
    setWatermark: (id: string) => Promise<boolean>;
}

/**
 * 水印项目类型，可以是文本水印或图片水印
 */
export declare type DocxWatermarkItem = {
    /**
     * 水印类型：文本
     */
    type: 'text';
    /**
     * 水印唯一标识，根据微软的习惯，水印 id 一般都是以 PowerPlusWaterMarkObject 开头的
     */
    id: string;
    /**
     * 文本水印属性值
     */
    value: DocxTextWatermark;
} | {
    /**
     * 水印类型：图片
     */
    type: 'image';
    /**
     * 水印唯一标识，根据微软的习惯，水印 id 一般都是以 PowerPlusWaterMarkObject 开头的
     */
    id: string;
    /**
     * 图片水印属性值
     */
    value: DocxImageWatermark;
};

/**
 * 文本水印配置接口
 */
export declare type DocxWatermarkOptions = EditorWatermarkOptions;

/**
 * 文档窗口接口
 */
export declare interface DocxWindow {
    /**
     * 滚动到指定位置
     * @param x
     * @param y
     */
    scrollTo: (x: number, y: number) => void;
    /**
     * 滚动到指定页面
     * @param page
     */
    scrollToPage: (page: number) => void;
    /**
     * 将传入的区域滚动到可视区域
     * @param range
     */
    scrollIntoView: (range: DocxRangeValue) => void;
    /**
     * 添加滚动监听器
     * @param listener
     */
    addScrollListener: (listener: (offset: {
        x: number;
        y: number;
    }) => void) => () => void;
}

/**
 * 文档缩放接口
 */
export declare interface DocxZoom {
    /**
     * 获取当前缩放比例。
     * @returns
     */
    getPercentage: () => number;
    /**
     * 设置缩放比例，
     * 有效范围 10 ~ 500。
     * @param percentage
     */
    setPercentage: (percentage: number) => void;
    /**
     * 设置自动缩放模式，
     * none: 不自动缩放，默认值。
     * window: 根据窗口宽度自动缩放，页面宽度随着窗口宽度变化而变化
     * page: 根据页面尺寸自动缩放，将页面缩放到可以完整显示的大小
     * @param mode 缩放模式，可以是 'window' 或 'page'
     */
    setFitMode: (mode: 'none' | 'window' | 'page') => void;
    /**
     * 获取当前缩放模式。
     * @returns
     */
    getFitMode: () => 'none' | 'window' | 'page';
    /**
     * 放大。
     */
    zoomIn: () => void;
    /**
     * 缩小。
     */
    zoomOut: () => void;
}

/**
 * 编辑器内部资源请求配置
 */
export declare interface EditorAssetsOptions {
    /**
     * 通用资源请求代理配置，
     * 用于套件内部资源请求时代理请求
     */
    proxy: HTTPProxy;
    /**
     * 资源文件 URL 转换和解析
     */
    resolver: EditorAssetsResolver;
    /**
     * 图片处理器
     */
    imageProcessing: EditorAssetsOssImageProcessing;
}

/**
 * 基于对象存储的图片处理抽象
 */
export declare interface EditorAssetsOssImageProcessing {
    /**
     * 压缩图片的方法
     * @param imageUrl 图片的 URL
     * @param compressOptions 压缩配置，例如质量、最大宽度和最大高度
     * @returns 压缩后的图片 URL
     */
    compress: (imageUrl: string, compressOptions?: {
        quality?: number;
        maxWidth?: number;
        maxHeight?: number;
    }) => Promise<string>;
    /**
     * 裁切图片的方法
     * @param imageUrl 图片的 URL
     * @param cropOptions 裁切配置，例如宽度、高度和起始点
     * @returns 裁切后的图片 URL
     */
    crop: (imageUrl: string, cropOptions: {
        x?: number;
        y?: number;
        w: number;
        h: number;
        g?: EditorImageCropPoint;
    }) => Promise<string>;
}

export declare interface EditorAssetsResolver {
    /**
     * 将资源文件 ID 转换为 URL 的方法
     * @param assetId 资源文件 ID
     * @returns 转换后的资源 URL ，如果无法转换则返回 null
     */
    resolveUrl: (assetId: string) => Promise<string | null>;
    /**
     * 从 URL 中解析资源文件 ID 的方法
     * @param url 资源 URL
     * @returns 解析出的资源文件 ID
     */
    parseId: (url: string) => Promise<string | null>;
    /**
     * 检查资源文件 ID 对应的文件是否准备就绪，
     * 在部分环境中，资源文件需要异步导入，在编辑器加载的时候可能还未准备就绪
     * @param assetId 资源文件 ID
     * @returns
     */
    checkAssetReady: (assetId: string) => Promise<boolean> | boolean;
}

/**
 * 品牌相关设置，
 * 用于在套件中展示品牌外露信息
 */
export declare interface EditorBrandOptions {
    /**
     * 需要显示在品牌展示位的内容，按数组顺序显示
     */
    content: Array<{
        type: 'image';
        src: string;
    } | {
        type: 'text';
        content: string;
        color?: string;
    }>;
    /**
     * 品牌展示位的布局信息
     */
    layout: {
        width: string;
        height: string;
    };
}

/**
 * 单条评论数据
 */
export declare interface EditorCommentItem {
    /**
     * 评论 ID
     */
    id: string;
    /**
     * 评论用户信息
     */
    user: {
        id: string;
        name: string;
    };
    content: {
        text: string;
    };
}

export declare interface EditorComments {
    /**
     * 检查是否有评论
     * @returns
     */
    hasAny: () => Promise<boolean>;
    /**
     * 获取评论列表
     * @returns
     */
    getAll: () => Promise<EditorCommentItem[]>;
    /**
     * 获取单个评论
     * @param commentId
     * @returns
     */
    getOne: (commentId: string) => Promise<EditorCommentItem | null>;
    /**
     * 添加内容
     * @param options
     * @returns
     */
    add: (options: {
        /**
         * 评论内容
         */
        text: string;
        /**
         * 默认评论是添加到当前选区上，也可以指定一个区域
         */
        range?: string;
    }) => Promise<string | null>;
    /**
     * 删除所有评论
     * @returns
     */
    deleteAll: () => Promise<boolean>;
    /**
     * 删除单条评论
     */
    deleteOne: (commentId: string) => Promise<boolean>;
}

/**
 * 编辑器评论初始化配置
 */
export declare interface EditorCommentsOptions {
    /**
     * 评论作者信息，如果这里的信息为空，将会使用 user 信息
     */
    author?: {
        /**
         * 评论作者 ID
         */
        id: string;
        /**
         * 评论作者信息
         */
        name: string;
        /**
         * 评论作者头像
         */
        avatar?: string;
    };
    /**
     * 显示的视图配置
     */
    view?: {
        /**
         * 评论显示模式，
         * none: 不显示评论，默认值。
         * card: 评论以卡片形式显示。
         */
        mode: 'none' | 'card';
    };
}

export declare interface EditorContent {
    /**
     * 设置编辑器内容
     * @param content
     */
    setContent: (content: string | ArrayBuffer) => Promise<void>;
    /**
     * 获取编辑器内容
     */
    getContent: () => Promise<EditorDelta>;
    /**
     * 添加监听，当内容发生变化时触发监听，传入 Delta
     * @param listener
     */
    addChangeListener: (listener: (change: EditorDelta) => void) => () => void;
}

export declare interface EditorDelta {
    compose: (other: EditorDelta, isDocument?: boolean) => EditorDelta;
    transform: (other: EditorDelta, priority?: boolean) => EditorDelta;
    stringify: () => string;
    length: number;
}

/**
 * 编辑器嵌入对象
 */
export declare interface EditorEmbeddedObject {
    /**
     * 嵌入的对象 url
     */
    url: string;
    /**
     * 嵌入对象的类型描述
     */
    type?: string;
    /**
     * 嵌入对象的名
     */
    name?: string;
}

/**
 * 编辑器嵌入对象抽象类
 */
export declare interface EditorEmbeddedObjectOptions {
    /**
     * 执行打开嵌入对象操作，
     * 如果已经处理了打开操作，返回 true，否则返回 false，
     * 如果返回 false，编辑器会继续后续默认的打开操作。
     * @param object
     * @returns
     */
    open: (object: EditorEmbeddedObject) => Promise<boolean>;
    /**
     * 嵌入对象的页面功能
     */
    ui?: {
        /**
         * 预览功能
         */
        preview?: {
            disabled?: boolean;
        };
        /**
         * 下载功能
         */
        download?: {
            disabled?: boolean;
        };
    };
}

export declare interface EditorFontFace {
    /**
     * 字体的名称，用于在用户界面上显示的名称
     */
    name: string;
    /**
     * 字体族
     */
    family: string;
    /**
     * 用于加载字体的 URL
     */
    url?: string;
    /**
     * 是否为受版权保护的字体，如果是在用户界面上会有所标识。
     */
    isCopyrightProtected: boolean;
    /**
     * 字体元数据
     */
    meta: EditorFontMeta;
}

/**
 * 字体元数据
 */
export declare interface EditorFontMeta {
    head: {
        unitsPerEm: number;
    };
    hhea: {
        ascender: number;
        descender: number;
        lineGap: number;
    };
    vhea?: {
        ascender: number;
        descender: number;
        lineGap: number;
    };
    os2: {
        usWeightClass?: number;
        usWidthClass?: number;
        italic?: boolean;
        isSymbol?: boolean;
        ulCodePageRange: [number, number];
    };
    /**
     * opentype中没有强制要求必须有en条目，只能确定name下的value的类型是对象
     */
    name: {
        preferredFamily?: Record<string, string>;
        preferredSubfamily?: Record<string, string>;
        fontFamily?: Record<string, string>;
        fontSubfamily?: Record<string, string>;
        fullName?: Record<string, string>;
        postScriptName?: Record<string, string>;
    };
}

/**
 * 字体列表
 */
export declare interface EditorFontsList {
    /**
     * 返回解析为字体的列表的 Promise。
     */
    getAll: () => Promise<EditorFontFace[]>;
}

export declare interface EditorFontsOptions {
    /**
     * 服务器字体列表，用于获取服务器端配置的字体列表，
     * 并提供可用于字体的加载 URL 和字体元数据。
     */
    list: EditorFontsList;
}

/**
 * i18n 相关设置
 */
export declare interface EditorI18nOptions {
    /**
     * 语言，默认使用浏览器当前环境中的语言
     */
    language?: string;
    /**
     * 文本方向，默认根据语言自动适配
     */
    direction?: 'ltr' | 'rtl';
}

export declare type EditorImageCropPoint = 'nw' | 'north' | 'ne' | 'west' | 'center' | 'east' | 'sw' | 'south' | 'se';

/**
 * 链接配置，抽象打开链接等操作
 */
export declare interface EditorLinkOptions {
    /**
     * 打开链接，如果取消了打开链接操作，返回 false
     * @param url
     * @param target
     * @returns
     */
    open: (url: string, target: string) => Promise<boolean>;
}

/**
 * 菜单栏自定义按钮配置
 */
export declare type EditorMenuCustomButton = {
    /**
     * 按钮名称
     */
    name: string;
    /**
     * 链接
     */
    type: 'link';
    /**
     * 按钮文本
     */
    text: string;
    /**
     * 链接地址
     */
    url: string;
} | {
    /**
     * 按钮名称
     */
    name: string;
    /**
     * 按钮，点击后触发 callback 回调
     */
    type: 'button';
    /**
     * 按钮文本
     */
    label: string;
    /**
     * 按钮图标，可以是 base64 的图片信息，也可以是图片 url
     */
    icon?: string;
    /**
     * 按钮点击事件
     */
    callback: () => void;
};

/**
 * 菜单栏二级以下的菜单入口
 */
export declare interface EditorMenuEntryButton {
    type: 'entry';
    /**
     * 菜单名称
     */
    name: string;
    /**
     * 菜单图标
     */
    icon?: string;
}

/**
 * 菜单栏一级菜单配置，此处用于定义一级菜单的操作入口，
 * 一级菜单在鼠标悬停时展示二级列表
 */
export declare interface EditorMenuEntryConfig<TName extends string> {
    /**
     * 一级菜单名称
     */
    name: string;
    /**
     * 二级菜单定义，定一个二维数组，用于定义二级菜单的结构，
     * 将第一层数组中的所有按钮放到一个区域内用分隔符隔开，
     * 第二层数组为按钮的定义，可以是功能按钮也可以是一个下拉入口。
     */
    children: Array<EditorMenuFeatureButton<TName> | EditorMenuEntryButton>[];
}

/**
 * 菜单栏功能按钮配置
 */
export declare type EditorMenuFeatureButton<TName extends string> = {
    /**
     * 隐藏按钮，用作在需要隐藏菜单栏时定义
     */
    type: 'hidden';
    /**
     * 按钮名称
     */
    name: TName;
} | {
    type: 'button';
    /**
     * 按钮名称
     */
    name: TName;
    /**
     * 按钮标签（显示文本）
     */
    label: string;
    /**
     * 按钮图标，可以是 base64 的图片信息，也可以是图片 url
     */
    icon?: string;
};

/**
 * 菜单栏按钮配置
 */
export declare type EditorMenuFeatureButtonConfig<TName extends string> = Record<TName, EditorMenuFeatureButton<TName>>;

/**
 * 菜单栏相关配置，目前菜单栏不是所有套件都支持，
 * 菜单栏是指的编辑器最上放可以展开二级菜单的那一栏。
 */
export declare interface EditorMenuOptions<TName extends string> {
    /**
     * 菜单栏是否显示
     */
    visible?: boolean;
    /**
     * 是否禁用菜单栏所有功能
     */
    disabled?: boolean;
    /**
     * 菜单栏一级菜单配置
     */
    entries?: EditorMenuEntryConfig<TName>[];
    /**
     * 菜单栏功能按钮配置
     */
    features?: Partial<EditorMenuFeatureButtonConfig<TName>>;
    /**
     * 自定义按钮配置
     */
    custom?: EditorMenuCustomButton[];
}

/**
 * 编辑器基础模式接口
 */
export declare interface EditorMode {
    /**
     * 获取当前编辑器模式
     */
    getModeType: () => EditorModeType;
    /**
     * 设置编辑器权限模式，仅在  模式下有效
     * @param permission
     */
    setStandardRole: (standardRole: EditorStandardRole) => Promise<void>;
    /**
     * 获取当前编辑器权限模式，仅在  模式下有效
     */
    getStandardRole: () => EditorStandardRole;
}

/**
 * 编辑器初始化的时相关的模式配置
 */
export declare type EditorModeOptions = {
    type: 'standard';
    /**
     * 当 mode 为  时，可以设置当前编辑器的权限模式
     */
    role?: EditorStandardRole;
} | {
    type: 'preview';
} | {
    type: 'presentation';
};

/**
 * 编辑器模式
 * -  标准模式，会根据用户权限配置不同的功能
 * -  预览模式，只能查看内容
 * -  演示模式，用作演示场景，演示模式下部分套件可以进行一些简单的编辑操作
 */
export declare type EditorModeType = 'standard' | 'preview' | 'presentation';

/**
 * 编辑器初始化通用参数
 */
export declare interface EditorOptions {
    /**
     * 编辑器初始化内容，可以是 string 或者 ArrayBuffer，
     * 也可以通过异步 Promise 加载
     */
    content: MaybePromiseValue<string | ArrayBuffer>;
    /**
     * 初始化时的编辑模式，默认为 
     */
    mode?: EditorModeOptions;
    /**
     * 当前操作编辑器的用户信息
     */
    user?: EditorUserOptions;
    /**
     * i18n 相关设置
     */
    i18n?: EditorI18nOptions;
    /**
     * 品牌相关设置
     */
    brand?: EditorBrandOptions;
    /**
     * 工具栏相关设置
     */
    toolbar?: EditorToolbarOptions;
    /**
     * 编辑器内部资源请求配置
     */
    assets?: EditorAssetsOptions;
    /**
     * 编辑器内部超链接设置
     */
    link?: EditorLinkOptions;
    /**
     * 嵌入对象相关配置
     */
    embeddedObject?: EditorEmbeddedObjectOptions;
    /**
     * 初始化水印配置
     */
    watermark?: EditorWatermarkOptions;
    /**
     * 编辑器打印设置
     */
    print?: EditorPrintOptions;
    /**
     * 编辑器评论设置
     */
    comments?: EditorCommentsOptions;
}

/**
 * 大纲目录接口
 */
export declare interface EditorOutline<Content = unknown> {
    /**
     * 设置大纲目录是否可见
     * @param visible 是否可见
     */
    setVisible: (visible: boolean) => void;
    /**
     * 获取目录信息
     * @returns 目录信息
     */
    getContent: () => Promise<EditorOutlineItem<Content>[]>;
    /**
     * 添加目录信息改变时的监听器
     * @param listener 监听器
     * @returns 取消监听器的函数
     */
    addChangedListener: (listener: (content: EditorOutlineItem<Content>[]) => void) => () => void;
    /**
     * 跳转到指定条目对应的正文位置
     * @param id 条目id
     * @returns 跳转是否成功
     */
    goto: (id: string) => Promise<boolean>;
}

/**
 * 大纲目录项条目
 */
export declare interface EditorOutlineItem<Content = unknown> {
    /**
     * 目录项 ID
     */
    id: string;
    /**
     * 目录项层级
     */
    level: number;
    /**
     * 目录项内容
     */
    content: Content;
}

/**
 * 大纲目录初始化参数，
 * 用于配置大纲目录的行为和外观。
 */
export declare interface EditorOutlineOptions {
    /**
     * 初始化编辑器时是否显示大纲目录，
     * 默认为 false。
     */
    visible?: boolean;
}

/**
 * 编辑器打印设置
 */
export declare interface EditorPrintOptions {
    /**
     * 部分套件如果绕过了编辑器预设的打印接口，直接通过拉起了浏览器的打印页面，这时打印页面无法获取到编辑器的内容，
     * 这种情况下就会 fallback 到这个 options 上，显示一个提示信息。
     */
    fallback?: {
        message: string;
    };
    /**
     * 是否禁用打印功能
     */
    disabled?: boolean;
}

/**
 * 编辑器通用接口
 */
export declare abstract class EditorSDK {
    protected options: EditorOptions;
    constructor(options: EditorOptions);
    /**
     * 初始化编辑器、加载插件等操作。
     */
    abstract init(): Promise<void>;
    /**
     * 销毁编辑器
     */
    abstract destroy(): Promise<void>;
    /**
     * 将编辑器挂载到指定的根节点上，并渲染，
     * mount 应该在 init 之后调用。
     * @param root
     */
    abstract mount(root: HTMLElement): Promise<void>;
    /**
     * 从根节点卸载编辑器，对应 /dev/sdb1 on / type ext4 (rw,relatime,discard,errors=remount-ro,commit=30)
devtmpfs on /dev type devtmpfs (rw,nosuid,noexec,relatime,size=8184096k,nr_inodes=2046024,mode=755,inode64)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev,inode64)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,nodev,size=3274692k,nr_inodes=819200,mode=755,inode64)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k,inode64)
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
bpf on /sys/fs/bpf type bpf (rw,nosuid,nodev,noexec,relatime,mode=700)
systemd-1 on /proc/sys/fs/binfmt_misc type autofs (rw,relatime,fd=32,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=1905)
hugetlbfs on /dev/hugepages type hugetlbfs (rw,nosuid,nodev,relatime,pagesize=2M)
mqueue on /dev/mqueue type mqueue (rw,nosuid,nodev,noexec,relatime)
debugfs on /sys/kernel/debug type debugfs (rw,nosuid,nodev,noexec,relatime)
tracefs on /sys/kernel/tracing type tracefs (rw,nosuid,nodev,noexec,relatime)
fusectl on /sys/fs/fuse/connections type fusectl (rw,nosuid,nodev,noexec,relatime)
configfs on /sys/kernel/config type configfs (rw,nosuid,nodev,noexec,relatime)
/dev/sdb16 on /boot type ext4 (rw,relatime,discard)
/dev/sdb15 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
binfmt_misc on /proc/sys/fs/binfmt_misc type binfmt_misc (rw,nosuid,nodev,noexec,relatime)
/dev/sda1 on /mnt type ext4 (rw,relatime,x-systemd.after=cloud-init.service,_netdev)
tmpfs on /run/user/1001 type tmpfs (rw,nosuid,nodev,relatime,size=1637344k,nr_inodes=409336,mode=700,uid=1001,gid=118,inode64) 操作
     */
    abstract unmount(): Promise<void>;
    /**
     * 编辑器内容相关接口
     */
    abstract get content(): EditorContent;
    /**
     * 编辑器模式相关接口
     */
    abstract get mode(): EditorMode;
    /**
     * 编辑器评论相关接口
     */
    abstract get comments(): EditorComments;
}

/**
 * 编辑器在  模式下的权限模式
 * - [?2004h)0[1;24r[m(B[4l[?7h[?25l[?25h[24;1H[?2004l 编辑模式
 * -  阅读模式
 * -  评论模式
 */
export declare type EditorStandardRole = 'editor' | 'viewer' | 'reviewer';

/**
 * 文本格式接口，
 * 包括设置、读取选区内文本的 BIUS、family、大小、颜色等
 */
export declare interface EditorText<Color = string, TRangeValue = unknown> {
    /**
     * 获取当前选区或指定选区内的文本格式状态
     */
    get: (range?: TRangeValue) => Partial<EditorTextFormat<Color>>;
    /**
     * 将文本的格式应用到当前选区或指定选区上，
     * 传入的非空字段会覆盖对应的属性，其他没有传入的属性会保持不变。
     * @param range
     * @param format
     * @returns
     */
    apply: (format: Partial<EditorTextFormat<Color>>, range?: TRangeValue) => Partial<EditorTextFormat<Color>>;
    /**
     * 清空当前选区或指定选区内文本的格式，将文本格式恢复到默认状态
     * @param range
     * @returns
     */
    clear: (range: TRangeValue) => void;
}

/**
 * 文本格式状态
 */
export declare interface EditorTextFormat<Color = string> {
    /**
     * 粗体
     */
    bold: boolean;
    /**
     * 斜体
     */
    italic: boolean;
    /**
     * 下划线
     */
    underline: boolean;
    /**
     * 删除线
     */
    strike: boolean;
    /**
     * 文本颜色
     */
    color: Color;
    /**
     * 文本背景高亮颜色
     */
    highlight: Color;
    /**
     * 文本大小
     */
    size: number | string;
    /**
     * 文本名称
     */
    family: string;
}

/**
 * 文本格式初始化选项
 */
export declare interface EditorTextOptions<Color = string> {
    /**
     * 当前编辑器默认的文本格式
     */
    defaultFormat?: Partial<EditorTextFormat<Color>>;
}

/**
 * 工具栏自定义按钮配置
 */
export declare interface EditorToolbarCustomButton extends Omit<EditorToolbarFeatureButton, 'name'> {
    /**
     * 自定义按钮名称
     */
    name: string;
    /**
     * 按钮点击事件
     */
    callback: () => void;
    /**
     * 按钮在工具栏中的位置，默认添加到工具栏所有按钮后面
     */
    index?: number;
}

/**
 * 工具栏自定义按钮配置
 */
export declare interface EditorToolbarCustomButtonConfig {
    /**
     * 按钮配置
     */
    [key: string]: EditorToolbarCustomButton;
}

/**
 * 工具栏内置功能按钮配置
 */
export declare interface EditorToolbarFeatureButton {
    /**
     * 按钮类型
     */
    name: EditorToolbarFeatureButtonName;
    /**
     * 按钮标签（显示文本）
     */
    label?: string;
    /**
     * 按钮图标，可以是 base64 的图片信息，也可以是图片 url
     */
    icon?: string;
    /**
     * 按钮是否禁用
     */
    disabled?: boolean;
    /**
     * 按钮提示文本
     */
    tooltip?: string;
}

/**
 * 工具栏内置功能按钮配置
 */
export declare type EditorToolbarFeatureButtonConfig = {
    [key in EditorToolbarFeatureButtonName]?: EditorToolbarFeatureButton;
};

/**
 * 工具栏内置功能按钮
 */
export declare type EditorToolbarFeatureButtonName = 
/**
* 加粗
*/
'bold'
/**
* 斜体
*/
| 'italic'
/**
* 下划线
*/
| 'underline'
/**
* 删除线
*/
| 'strikethrough'
/**
* 插入图片
*/
| 'insertImage'
/**
* 插入链接
*/
| 'insertLink'
/**
* 限制编辑
*/
| 'restriction';

/**
 * 工具栏相关设置，可以控制工具栏的显示内容
 */
export declare interface EditorToolbarOptions {
    /**
     * 控制工具栏显隐状态
     */
    visible?: boolean;
    /**
     * 是否禁用工具栏所有功能
     */
    disabled?: boolean;
    /**
     * 现有按钮的功能配置
     */
    features?: EditorToolbarFeatureButtonConfig;
    /**
     * 自定义按钮
     */
    custom?: EditorToolbarCustomButtonConfig;
}

/**
 * 操作当前编辑器的用户信息
 */
export declare interface EditorUserOptions {
    /**
     * 用户 ID，用于标识用户
     */
    uid: string;
    /**
     * 用户名
     */
    name: string;
    /**
     * 用户头像
     */
    avatar?: string;
}

/**
 * 编辑器外部水印信息
 */
export declare interface EditorWatermarkOptions {
    /**
     * 获取用作初始化使用的默认水印
     */
    getWatermark: () => MaybePromiseValue<EditorWatermarkResource | null>;
    /**
     * 是否必须，如果为 true，编辑器将在初始化时强制渲染水印，
     * 水印配置信息加载失败将导致编辑器初始化失败
     */
    required?: boolean;
}

export declare type EditorWatermarkResource = {
    type: 'data-url';
    url: string;
} | {
    type: 'object-url';
    url: string;
};

/**
 * 请求、响应头
 */
export declare type HTTPHeaders = Record<string, string | number | boolean | undefined>;

/**
 * 请求方法
 */
export declare type HTTPMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';

/**
 * HTTP 代理，用于抽象 HTTP 请求，
 * 将请求代理编辑器外部
 */
export declare interface HTTPProxy {
    /**
     * 发送请求，如果需要做请求、响应拦截，需要在 proxy.interceptors 中实现，
     * 套件内使用 proxy 发送请求的方式应该为类似如下方式:
     * 
     *
     * 套件内如果需要通过其他方式发送请求，比如通过浏览器的 Image API 加载，可以使用 proxy.interceptors?.request?.intercept(requestConfig) 处理请求配置
     * @param config
     * @returns
     */
    request: <D = unknown, T = unknown>(config: HTTPRequestConfig<D>) => Promise<HTTPResponse<T>>;
    /**
     * 请求、响应拦截器，
     *
     */
    interceptors?: {
        request?: {
            /**
             * 请求拦截器，传入请求配置，返回处理后的请求配置
             * @param requestConfig 请求配置
             * @returns
             */
            intercept: <D = unknown>(requestConfig: HTTPRequestConfig<D>) => HTTPRequestConfig<D>;
        };
        response?: {
            /**
             * 响应拦截器，传入响应，返回处理后的响应
             * @param response
             * @returns
             */
            intercept: <T = unknown>(response: HTTPResponse<T>) => HTTPResponse<T>;
        };
    };
    /**
     * 创建一个新的 HTTP 代理，用于为不同请求场景创建不同的代理
     * @param id
     * @returns
     */
    create: (id: string) => Promise<HTTPProxy>;
}

/**
 * 请求配置
 */
export declare interface HTTPRequestConfig<Data = unknown> {
    /**
     * 请求地址
     */
    url: string;
    /**
     * 请求方法
     */
    method?: HTTPMethod;
    /**
     * 请求携带数据，主要是 POST、PUT、PATCH 等方法的请求数据
     */
    data?: Data;
    /**
     * 期望的响应数据类型
     */
    responseType?: HTTPResponseType;
    /**
     * 请求头
     */
    headers?: HTTPHeaders;
}

/**
 * 响应数据
 */
export declare interface HTTPResponse<Data = unknown> {
    /**
     * 响应数据 body
     */
    data: Data;
    /**
     * 响应状态码
     */
    status: number;
    /**
     * 响应头
     */
    headers: HTTPHeaders;
}

/**
 * 请求返回类型
 */
export declare type HTTPResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export declare type MaybePromiseValue<T> = T | Promise<T>;

/**
 * pdf 工具栏一级菜单
 */
export declare type PdfMenuEntryConfig = EditorMenuEntryConfig<PdfMenuFeatureButtonName>;

/**
 * 传统文档工具栏功能按钮
 */
export declare type PdfMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<PdfMenuFeatureButtonName>;

/**
 * pdf 工具栏内置功能按钮
 */
export declare type PdfMenuFeatureButtonName = 'selectAll';

export declare type PdfMenuOptions = EditorMenuOptions<PdfMenuFeatureButtonName>;

/**
 * pdf 目录大纲项接口
 */
export declare type PdfOutline = EditorOutline<{
    text: string;
}>;

/**
 * pdf 目录大纲项信息，用于描述 pdf 中的目录项信息。
 */
export declare type PdfOutlineItem = EditorOutlineItem<{
    text: string;
}>;

export declare type PdfOutlineOptions = EditorOutlineOptions;

/**
 * pdf 页面实例，
 * 可以通过实例对对应页面进行操作。
 */
export declare interface PdfPage {
    /**
     * 获取当前页码
     */
    readonly pageNumber: number;
    /**
     * 获取当前页面的大小
     * @returns
     */
    getPageSize: () => {
        width: number;
        height: number;
    };
}

/**
 * pdf 页面集合操作接口，
 * 该接口和 PdfPage 负责不同的功能，
 * PdfPage 是一个页面的抽象，而 PdfPages 是对整个 pdf 文件中所有页面的操作。
 */
export declare interface PdfPages {
    /**
     * 获取当前页码
     * @returns
     */
    getCurrentPageNumber: () => number;
    /**
     * 设置当前页码并跳转至对应页面
     * @param page
     */
    setCurrentPage: (page: number) => void;
    /**
     * 获取总页数
     * @returns
     */
    getPagesCount: () => number;
    /**
     * 获取指定页面
     */
    getPage: (page: number) => Promise<PdfPage | null>;
}

/**
 * 区域（Range）
 * 区域对象，表示文件中的一个连续区域，每个 Range 对象包含起始字符位置和终止字符位置。
 */
/**
 * Pdf 区域对象，
 * 用于表示 Pdf 中的一个连续区域，
 * 每个选区值包含了起始位置和结束位置信息。
 */
export declare interface PdfRange {
    /**
     * 区域的开始位置。
     */
    readonly start: string;
    /**
     * 区域的结束位置。
     */
    readonly end: string;
    /**
     * 获取该区域对应的纯文本信息。
     * @returns
     */
    getText: () => string;
    /**
     * 将区域中的内容以 HTML 格式返回。
     * @returns
     */
    getHtml: () => string;
    /**
     * 获取选区在当前屏幕上的位置信息
     * @returns
     */
    getBounding: () => PdfRangeBounding | null;
}

/**
 * 记录选区在屏幕上的矩形位置信息，
 * 包含整个选区包围盒的四个边界值（top, right, bottom, left），
 * 以及第一行开始和最后一行结束的横向坐标。
 * 这些信息是选区中所有 ClientRects 的集合范围。
 */
export declare interface PdfRangeBounding {
    /**
     * 区域的上边界值，
     * 表示所有选区中最上方的 Y 坐标。
     */
    top: number;
    /**
     * 区域的右边界值，
     * 表示所有选区中最右侧的 X 坐标。
     */
    right: number;
    /**
     * 区域的下边界值，
     * 表示所有选区中最下方的 Y 坐标。
     */
    bottom: number;
    /**
     * 区域的左边界值，
     * 表示所有选区中最左侧的 X 坐标。
     */
    left: number;
    /**
     * 第一行选区的起始 X 坐标。
     */
    start: number;
    /**
     * 最后一行选区的结束 X 坐标。
     */
    end: number;
}

export declare interface PdfRangeValue {
    start: string;
    end: string;
}

/**
 *  Pdf 初始化参数
 */
export declare interface PdfSDKOptions {
    /**
     *  Pdf 初始化内容，可以是 string 或者 ArrayBuffer，
     * 也可以通过异步 Promise 加载
     */
    content: MaybePromiseValue<string | ArrayBuffer>;
    /**
     * 当前操作 Pdf 的用户信息
     */
    user?: EditorUserOptions;
    /**
     * i18n 相关设置
     */
    i18n?: EditorI18nOptions;
    /**
     * 品牌相关设置
     */
    brand?: EditorBrandOptions;
    /**
     *  Pdf 内部资源请求配置
     */
    assets?: EditorAssetsOptions;
    /**
     *  Pdf 内部超链接设置
     */
    link?: EditorLinkOptions;
    /**
     * 初始化水印配置
     */
    watermark?: EditorWatermarkOptions;
    /**
     *  Pdf 打印设置
     */
    print?: EditorPrintOptions;
    /**
     *  Pdf 大纲目录设置
     */
    outline?: PdfOutlineOptions;
    /**
     *  Pdf 菜单栏设置
     */
    menu?: PdfMenuOptions;
}

/**
 * 选区（Selection）
 * 表示窗口或窗格中的当前选定内容。
 */
export declare interface PdfSelection {
    /**
     * 获取选区的区域范围，
     * 如果没有指定范围，则返回当前选区的范围。
     * 如果指定了范围，则返回指定范围的选区。
     * 如果选区不存在，则返回 null。
     * @returns
     */
    getRange: (value?: PdfRangeValue) => PdfRange | null;
    /**
     * 设置选区的区域范围，
     * 设置后，选区会自动选中指定范围。
     * 如果设置为 null，则清空选区。
     * @param bounds
     */
    setRange: (vale: PdfRangeValue | null) => void;
    /**
     * 添加选区变化监听器，当选区发生变化时，会触发回调。
     * @param listener
     * @returns
     */
    addRangeListener: (listener: (value: PdfRangeValue | null) => void) => void;
}

export declare type PresentationFontFace = EditorFontFace;

export declare type PresentationFontMeta = EditorFontMeta;

export declare interface PresentationFontsList {
    getAll: () => Promise<PresentationFontFace[]>;
}

export declare interface PresentationFontsOptions {
    list: PresentationFontsList;
}

/**
 * 幻灯片工具栏一级菜单
 */
export declare type PresentationMenuEntryConfig = EditorMenuEntryConfig<PresentationMenuFeatureButtonName>;

/**
 * 幻灯片工具栏功能按钮
 */
export declare type PresentationMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<PresentationMenuFeatureButtonName>;

/**
 * 幻灯片工具栏内置功能按钮
 */
export declare type PresentationMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll';

export declare type PresentationMenuOptions = EditorMenuOptions<PresentationMenuFeatureButtonName>;

export declare interface PresentationSDKOptions extends EditorOptions {
    /**
     * 字体配置
     */
    fonts?: PresentationFontsOptions;
    /**
     * 菜单栏相关设置
     */
    menu?: PresentationMenuOptions;
    /**
     * 文本格式相关设置
     */
    text?: PresentationTextOptions;
}

/**
 * 选区（Selection）
 * 表示窗口中的当前选定内容。
 * 选定内容表示幻灯片中的选定（或突出显示）区域，或者代表插入点（如果未选择幻灯片中的任何内容）。
 */
export declare interface PresentationSelection {
    /**
     * 获取选区的区域范围，
     * 如果没有指定范围，则返回当前选区的范围。
     * 如果指定了范围，则返回指定范围的选区。
     * 如果选区不存在，则返回 null。
     * @returns
     */
    getTextRange: (value?: PresentationTextRangeValue) => PresentationTextRange | null;
    /**
     * 设置选区的区域范围，
     * 设置后，选区会自动选中指定范围。
     * 如果设置为 null，则清空选区。
     * @param value
     */
    setTextRange: (value: PresentationTextRangeValue | null) => void;
    /**
     * 获取当前选中的形状，
     * 如果没有选中形状，则返回 null。
     * 如果指定了 value，则返回指定形状。
     * @param ids 指定的形状 id
     * @returns
     */
    getSelectedShapes: (ids?: string[]) => PresentationShape[] | null;
    /**
     * 选中指定的形状，选中形状后会清空文字选区。
     * 如果 value 为 null，则清空选中的形状。
     * @param ids 指定的形状 id
     * @returns
     */
    setSelectedShapes: (ids: string[] | null) => void;
    /**
     * 添加选区变化监听器，当选区发生变化时，会触发回调。
     * @param listener
     * @returns
     */
    addRangeListener: (listener: (value: PresentationTextRangeValue | null) => void) => void;
}

/**
 * 幻灯片形状(Shape)接口
 */
export declare interface PresentationShape {
    /**
     * 获取形状的 id
     */
    readonly id: string;
}

/**
 * 幻灯片页面(Slide)对象，
 * 是幻灯片的基础操作单元，包含幻灯片的基本信息和操作方法。
 */
export declare interface PresentationSlide {
    /**
     * 当前幻灯片的 id
     */
    readonly id: string;
    /**
     * 获取当前幻灯片在所有幻灯片中的索引
     * @returns
     */
    getIndex: () => number;
    /**
     * 获取当前页面所有的形状
     * @returns
     */
    getShapes: () => PresentationShape[];
}

/**
 * 幻灯片集合对象，
 * 该接口和 PresentationSlide 负责不同的功能，
 * PresentationSlide 是一个幻灯片页面的抽象，而 PresentationSlides 是对整个文件中所有页面的操作。
 */
export declare interface PresentationSlides {
    /**
     * 获取当前幻灯片
     */
    getCurrentSlide: () => PresentationSlide;
    /**
     * 切换当前幻灯片
     * @param slideId
     */
    setCurrentSlideIndex: (slideId: string) => void;
    /**
     * 获取幻灯片索引
     * @param slideId
     * @returns
     */
    getSlideIndex: (slideId: string) => number;
    /**
     * 获取幻灯片总数
     */
    getSlidesCount: () => number;
    /**
     * 获取所有幻灯片
     * @returns
     */
    getSlides: () => PresentationSlide[];
    /**
     * 获取指定幻灯片
     * @param slideId
     */
    getSlideById: (slideId: string) => PresentationSlide;
    /**
     * 获取当前选中的幻灯片。
     * 至少存在一个选中的幻灯片。
     * @returns
     */
    getSelectedSlides: (ids?: string[]) => PresentationSlide[];
    /**
     * 设置
     * @param ids
     * @returns
     */
    setSelectedSlides: (ids: string[]) => void;
}

/**
 * 演示文稿文本接口
 */
export declare type PresentationText = EditorText<string, PresentationTextRangeValue>;

/**
 * 演示文稿文本格式
 */
export declare type PresentationTextFormat = EditorTextFormat;

/**
 * 演示文稿文本格式初始化选项
 */
export declare type PresentationTextOptions = EditorTextOptions<string>;

/**
 * 区域（Range）
 * 区域对象，表示幻灯片页面中的一个连续的文字区域，每个 Range 对象包含起始字符位置和终止字符位置。
 * 区域信息是一个临时状态，当内容发生变化后，或切换了幻灯片 slide 区域信息可能会失效。
 */
/**
 * 幻灯片区域对象，
 * 用于表示页面中的一个连续区域，
 * 每个选区值包含了起始位置和结束位置信息的字符串。
 */
export declare interface PresentationTextRange {
    /**
     * 区域的开始位置，
     * 当内容发生变化后，区域的标识可能会失效。
     */
    readonly start: string;
    /**
     * 区域的结束位置，
     * 当内容发生变化后，区域的标识可能会失效。
     */
    readonly end: string;
    /**
     * 获取该区域对应的纯文本信息。
     * @returns
     */
    getText: () => string;
    /**
     * 设置该区域的内容
     * @param text 内容
     */
    setText: (text: string) => void;
    /**
     * 将区域中的内容以 HTML 格式返回
     */
    getHtml: () => string;
    /**
     * 设置该区域的内容为 HTML 格式
     * @param html 内容
     */
    setHtml: (html: string) => void;
}

export declare interface PresentationTextRangeValue {
    start: string;
    end: string;
}

/**
 * 幻灯片缩放接口
 */
export declare interface PresentationZoom {
    /**
     * 获取当前缩放比例。
     * @returns
     */
    getPercentage: () => number;
    /**
     * 设置缩放比例，
     * 有效范围 10 ~ 500。
     * @param percentage
     */
    setPercentage: (percentage: number) => void;
    /**
     * 设置自动缩放模式，
     * none: 不自动缩放，默认值。
     * window: 根据窗口宽度自动缩放，页面宽度随着窗口宽度变化而变化
     * @param mode 缩放模式，可以是 'window'
     */
    setFitMode: (mode: 'none' | 'window') => void;
    /**
     * 获取当前缩放模式。
     * @returns
     */
    getFitMode: () => 'none' | 'window';
    /**
     * 放大。
     */
    zoomIn: () => void;
    /**
     * 缩小。
     */
    zoomOut: () => void;
}

/**
 * 表格单元格对象
 */
export declare interface SheetCell {
    /**
     * 单元格所在的行号
     */
    row: number;
    /**
     * 单元格所在的列号
     */
    column: number;
    /**
     * 单元格所在的工作表 ID
     */
    sheetId: string;
    /**
     * 获取单元格的文本
     */
    getCellText: () => string;
    /**
     * 获取单元格的值
     */
    getCellValue: () => SheetCellValue | null;
}

/**
 * 单元格值类型
 */
export declare type SheetCellValue = {
    type: 'primitive';
    value: string | number | boolean;
} | {
    type: 'date';
    value: number;
} | {
    type: 'calcError';
    value: {
        error: string;
    };
};

/**
 * 电子表格工具栏一级菜单
 */
export declare type SheetMenuEntryConfig = EditorMenuEntryConfig<SheetMenuFeatureButtonName>;

/**
 * 电子表格工具栏功能按钮
 */
export declare type SheetMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<SheetMenuFeatureButtonName>;

/**
 * 电子表格工具栏内置功能按钮
 */
export declare type SheetMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll';

export declare type SheetMenuOptions = EditorMenuOptions<SheetMenuFeatureButtonName>;

/**
 * 表格区域对象，
 * 用于表示表格中被选中的单元格区域，
 * 可以是一个单元格、一行、一列、或某个区域。
 */
export declare interface SheetRange {
    /**
     * 区域类型
     */
    type: ;
    /**
     * 区域的行开始位置
     */
    readonly row: number;
    /**
     * 区域的列开始位置
     */
    readonly column: number;
    /**
     * 区域的行数
     */
    readonly rowCount: number;
    /**
     * 区域的列数
     */
    readonly columnCount: number;
    /**
     * 获取该区域对应的纯文本信息。
     * @returns
     */
    getText: () => string;
    /**
     * 设置该区域的内容
     * @param text 内容
     */
    setText: (text: string) => void;
    /**
     * 将区域中的内容以 HTML 格式返回
     */
    getHtml: () => string;
    /**
     * 设置该区域的内容为 HTML 格式
     * @param html 内容
     */
    setHtml: (html: string) => void;
}

/**
 * 区域（Range）
 * 区域对象，表示表格中的一个单元格区域，每个 Range 对象包含了一个或多个单元格、行、列信息。
 */
/**
 * 选区类型
 */
export declare enum SheetRangeType {
    /**
     * 选中一个或多个单元格
     */
    Cells = 'cells',
    /**
     * 选中一行或多行
     */
    Rows = rows,
    /**
     * 选中一列或多列
     */
    Columns = columns,
    /**
     * 选中整个工作表
     */
    Sheet = sheet
}

export declare type SheetRangeValue = {
    /**
     * 单个或多个单元格
     */
    type: ;
    /**
     * 起始单元格的行号
     */
    row: number;
    /**
     * 总计行数
     */
    rowCount: number;
    /**
     * 起始单元格的列号
     */
    column: number;
    /**
     * 总计列数
     */
    columnCount: number;
} | {
    /**
     * 一列或多列
     */
    type: ;
    /**
     * 起始列号
     */
    row: number;
    /**
     * 总计行数
     */
    rowCount: number;
} | {
    /**
     * 一行或多行
     */
    type: ;
    /**
     * 起始行号
     */
    column: number;
    /**
     * 总计列数
     */
    columnCount: number;
} | {
    /**
     * 整个工作表
     */
    type: ;
};

export declare interface SheetSDKOptions extends EditorOptions {
    /**
     * 字体配置
     */
    fonts?: EditorFontsOptions;
    /**
     * 菜单栏相关设置
     */
    menu?: SheetMenuOptions;
    /**
     * 文本格式相关设置
     */
    text?: SheetTextOptions;
}

/**
 * 选区（Selection）
 * 表示窗口或窗格中的当前选定内容。
 * 选定内容表示表格中的选定（或突出显示）的单元格区域。
 */
export declare interface SheetSelection {
    /**
     * 获取选区的区域范围，
     * 如果没有指定范围，则返回当前选区的范围。
     * 如果指定了范围，则返回指定范围的选区。
     * 如果选区不存在，则返回 null。
     */
    getRange: (value?: SheetRangeValue) => SheetRange | null;
    /**
     * 设置选区的区域范围，
     * 设置后，选区会自动选中指定范围。
     * 如果设置为 null，则清空选区。
     */
    setRange: (value: SheetRangeValue | null) => void;
}

/**
 * 电子表格文本接口
 */
export declare type SheetText = EditorText<string, SheetRangeValue>;

/**
 * 电子表格文本格式
 */
export declare type SheetTextFormat = EditorTextFormat;

/**
 * 电子表格文本格式初始化选项
 */
export declare type SheetTextOptions = EditorTextOptions<string>;

/**
 * 工作表集合对象
 */
export declare interface SheetWorkbook {
    /**
     * 获取所有工作表
     * @returns
     */
    getWorksheets: () => SheetWorksheet[];
    /**
     * 获取指定的工作表
     * @param sheetId
     * @returns
     */
    getWorksheetById: (sheetId: string) => SheetWorksheet | null;
    /**
     * 获取当前活动的工作表
     * TODO: 是否存在返回空的场景
     * @returns
     */
    getActiveWorksheet: () => SheetWorksheet;
    /**
     * 激活指定的工作表
     * @param sheetId
     */
    setActiveWorksheet: (sheetId: string) => void;
}

/**
 * 工作表对象
 */
export declare interface SheetWorksheet {
    /**
     * 工作表对应编号
     */
    get id(): string;
    /**
     * 获取当前工作表名称
     */
    get name(): string;
    /**
     * 这个工作表是否为当前活动的工作表
     */
    get isActive(): boolean;
    /**
     * 获取工作表的所有选区
     * @returns
     */
    getSelections: () => SheetSelection[] | null;
    /**
     * 获取选区的物理位置（相对于浏览器窗口），如果选区完全不在工作表的可视区域内，返回 null。
     * 其中选区超出可视区域的部分会被截断处理。
     *
     * 当工作表存在冻结行列时，可视区域将被分成四个部分（如果仅存在冻结行或冻结列则被分为两个部分），
     * 此时需要计算出选区在**视觉上**与可视区域的交集。
     */
    getPhysicalPosition: (range: SheetRangeValue) => {
        left: number;
        top: number;
        width: number;
        height: number;
    } | null;
    /**
     * 添加选区变化监听器，当选区发生变化时，会触发回调。
     * @param listener
     * @returns 用于移除监听的回调
     */
    addRangeListener: (listener: (range: {
        sheet: string;
        ranges: SheetRangeValue[] | null;
    }) => void) => () => void;
    /**
     * 获取工作表中指定区域的单元格对象
     * @returns
     */
    getCell: (row: number, column: number) => SheetCell | null;
    /**
     * 获取工作表中选中的单元格对象
     * @returns
     */
    getActiveCell: () => SheetCell | null;
    /**
     * 激活工作表中某个单元格
     * @param cell 单元格对象，需要传入行和列的索引值
     * @returns
     */
    setActiveCell: (cell: {
        row: number;
        column: number;
    }) => void;
    /**
     * 定位到单元格所在位置
     * @param row 单元格所在行
     * @param column 单元格所在列
     */
    locateCell: (row: number, column: number) => void;
}

export { }

