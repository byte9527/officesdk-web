
export declare abstract class AbstractedDiagramSDK {
    protected options: DiagramSDKOptions;
    constructor(options: DiagramSDKOptions);
    
    abstract init(): Promise<void>;
    
    abstract destroy(): Promise<void>;
    
    abstract mount(root: HTMLElement): Promise<void>;
    
    abstract unmount(): Promise<void>;
}

export declare abstract class AbstractedDocxSDK extends EditorSDK {
    
    abstract print(): Promise<void>;
    
    abstract goto(options: DocxGotoOptions): boolean;
    
    
    abstract get TOCs(): DocxTOCs;
    
    abstract get zoom(): DocxZoom;
    
    abstract get outline(): DocxOutline;
    
    abstract get selection(): DocxSelection;
    
    abstract get text(): DocxText;
    
    abstract get window(): DocxWindow;
    
    abstract get watermark(): DocxWatermark;
    
    abstract get search(): DocxSearch;
}


export declare abstract class AbstractedPdfSDK {
    protected options: PdfSDKOptions;
    constructor(options: PdfSDKOptions);
    
    abstract init(): Promise<void>;
    
    abstract destroy(): Promise<void>;
    
    abstract mount(root: HTMLElement): Promise<void>;
    
    abstract unmount(): Promise<void>;
    
    abstract get pages(): PdfPages;
    
    abstract get selection(): PdfSelection;
    
    abstract get outline(): PdfOutline;
}

export declare abstract class AbstractedPresentationSDK extends EditorSDK {
    
    abstract print(): Promise<void>;
    
    abstract get slides(): PresentationSlides;
    
    abstract get selection(): PresentationSelection;
    
    abstract get zoom(): PresentationZoom;
    
    abstract get text(): PresentationText;
}

export declare abstract class AbstractedSheetSDK extends EditorSDK {
    
    abstract print(): Promise<void>;
    
    abstract get workbook(): SheetWorkbook;
    
    abstract get activeSheet(): SheetWorksheet;
    
    abstract get activeCell(): SheetCell | null;
    
    abstract get selections(): SheetSelection[] | null;
    
    abstract get text(): SheetText;
}


export declare interface DiagramSDKOptions {
    
    content: MaybePromiseValue<string | ArrayBuffer>;
    
    user?: EditorUserOptions;
    
    i18n?: EditorI18nOptions;
    
    brand?: EditorBrandOptions;
    
    assets?: EditorAssetsOptions;
    
    link?: EditorLinkOptions;
    
    watermark?: EditorWatermarkOptions;
    
    print?: EditorPrintOptions;
}

export declare type DocxFontFace = Omit<EditorFontFace, 'meta'> & {
    meta: DocxFontMeta;
};

export declare interface DocxFontMeta {
    
    textMetrics: {
        
        unitsPerEm: number;
        
        ascender: number;
        
        descender: number;
        
        lineGap: number;
        
        extendScale?: number;
    };
    
    ulCodePageRange: [number, number];
    
    name?: EditorFontMeta['name'];
}

export declare interface DocxFontsList {
    getAll: () => Promise<DocxFontFace[]>;
}

export declare interface DocxFontsOptions {
    list: DocxFontsList;
}

export declare type DocxGotoOptions = {
    
    type: 'range';
    
    range: string;
} | {
    
    type: 'page';
    
    page: number;
} | {
    
    type: 'top';
} | {
    
    type: 'comment';
    
    commentId: string;
};


export declare interface DocxImageWatermark {
    
    image: string;
    
    width: string;
    
    height: string;
}


export declare interface DocxInfoOptions {
    views?: {
        count?: number;
    };
    created?: {
        time?: number;
        author?: string;
    };
}


export declare type DocxMenuEntryConfig = EditorMenuEntryConfig<DocxMenuFeatureButtonName>;


export declare type DocxMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<DocxMenuFeatureButtonName>;


export declare type DocxMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'export' | 'saveTemplate' | 'viewHistory' | 'saveHistory' | 'attachment' | 'cloudFile' | 'signature' | 'image';

export declare type DocxMenuOptions = EditorMenuOptions<DocxMenuFeatureButtonName>;


export declare type DocxOutline = EditorOutline<{
    text: string;
}>;


export declare type DocxOutlineItem = EditorOutlineItem<{
    text: string;
}>;

export declare type DocxOutlineOptions = EditorOutlineOptions;



export declare interface DocxRange {
    
    readonly start: string;
    
    readonly end: string;
    
    readonly isCaret: boolean;
    
    getText: () => string;
    
    getHtml: () => string;
    
    setText: (text: string) => void;
    
    setHtml: (html: string) => void;
    
    getBounding: () => DocxRangeBounding | null;
}


export declare interface DocxRangeBounding {
    
    top: number;
    
    right: number;
    
    bottom: number;
    
    left: number;
    
    start: number;
    
    end: number;
}


export declare interface DocxRangeValue {
    
    start: string;
    
    end: string;
}


export declare type DocxReplaceCallback = (result: DocxSearchResult, abort?: () => void) => void;

export declare interface DocxReplaceParams {
    
    value: string;
}

export declare interface DocxReplaceResult {
    
    id: string;
    
    oldValue: string;
}

export declare interface DocxSDKOptions extends EditorOptions {
    
    info?: DocxInfoOptions;
    
    fonts?: DocxFontsOptions;
    
    menu?: DocxMenuOptions;
    
    outline?: DocxOutlineOptions;
    
    text?: DocxTextOptions;
    
    watermark?: DocxWatermarkOptions;
    
    theme?: DocxThemeOptions;
}


export declare interface DocxSearch {
    
    findOne: (params: DocxSearchParams) => Promise<DocxSearchResult | null>;
    
    findAll: (params: DocxSearchParams, callback: DocxSearchCallback) => void;
    
    replaceOne: (id: string, params: DocxReplaceParams) => Promise<DocxReplaceResult | null>;
    
    replaceAll: (params: DocxReplaceParams, callback: DocxReplaceCallback) => void;
    
    clear: () => void;
}


export declare type DocxSearchCallback = (results: DocxSearchResult[], abort?: () => void) => void;

export declare interface DocxSearchParams {
    
    content: string;
    
    highlight?: boolean;
}

export declare interface DocxSearchResult {
    
    content: string;
    
    keyword: string;
    
    range: DocxRangeValue;
    
    id: string;
}


export declare interface DocxSelection {
    
    getRange: (value?: DocxRangeValue) => DocxRange | null;
    
    setRange: (value: DocxRangeValue | null) => void;
    
    addRangeListener: (listener: (value: DocxRangeValue | null) => void) => void;
}


export declare type DocxText = EditorText<string, DocxRangeValue>;


export declare type DocxTextFormat = EditorTextFormat;


export declare type DocxTextOptions = EditorTextOptions<string>;


export declare interface DocxTextWatermark {
    
    text: string;
    
    font: string;
    
    bold: boolean;
    
    italic: boolean;
    
    color: string;
    
    size: string;
}

export declare interface DocxThemeFont {
    typeface: string;
}


export declare interface DocxThemeFontsScheme {
    
    major: DocxThemeFontsSchemeItem;
    
    minor: DocxThemeFontsSchemeItem;
}


export declare interface DocxThemeFontsSchemeItem {
    
    latin: DocxThemeFont;
    
    ea: DocxThemeFont;
    
    cs: DocxThemeFont;
    
    font: Record<string, DocxThemeFont>;
}


export declare interface DocxThemeOptions {
    
    fonts?: DocxThemeFontsScheme;
    
    preferences?: {
        
        fonts?: {
            
            disabled?: boolean;
            
            set?: (data: DocxThemeFontsScheme, id?: string) => Promise<boolean>;
            
            get?: (id?: string) => Promise<DocxThemeFontsScheme | null>;
        };
    };
}


export declare interface DocxTocContentItem {
    
    id: string;
    
    level: number;
    
    content: {
        
        text: string;
    };
}


export declare interface DocxTocItem {
    
    getContent: () => Promise<DocxTocContentItem[]>;
    
    addContentChangedListener: (listener: (content: DocxTocContentItem[]) => void) => () => void;
    
    goto: (id: string) => Promise<boolean>;
    
    update: () => Promise<boolean>;
    
    updatePageNumbers: () => Promise<boolean>;
    
    setLevel: (level: number) => Promise<boolean>;
}


export declare interface DocxTOCs {
    
    getAll: () => Promise<DocxTocItem[]>;
    
    getOne: (index: number) => Promise<DocxTocItem | null>;
    
    deleteAll: () => Promise<boolean>;
    
    deleteOne: (index: number) => Promise<boolean>;
    
    add: (options: {
        
        range?: string;
    }) => Promise<boolean>;
}


export declare interface DocxWatermark {
    
    getAll: () => Promise<DocxWatermarkItem[]>;
    
    getOne: (id: string) => Promise<DocxWatermarkItem | null>;
    
    addOne: (item: DocxWatermarkItem) => Promise<string>;
    
    deleteOne: (id: string) => Promise<boolean>;
    
    updateText: (id: string, value: DocxTextWatermark) => Promise<boolean>;
    
    updateImage: (id: string, value: DocxImageWatermark) => Promise<boolean>;
    
    deleteAll: () => Promise<string[]>;
    
    setWatermark: (id: string) => Promise<boolean>;
}


export declare type DocxWatermarkItem = {
    
    type: 'text';
    
    id: string;
    
    value: DocxTextWatermark;
} | {
    
    type: 'image';
    
    id: string;
    
    value: DocxImageWatermark;
};


export declare type DocxWatermarkOptions = EditorWatermarkOptions;


export declare interface DocxWindow {
    
    scrollTo: (x: number, y: number) => void;
    
    scrollToPage: (page: number) => void;
    
    scrollIntoView: (range: DocxRangeValue) => void;
    
    addScrollListener: (listener: (offset: {
        x: number;
        y: number;
    }) => void) => () => void;
}


export declare interface DocxZoom {
    
    getPercentage: () => number;
    
    setPercentage: (percentage: number) => void;
    
    setFitMode: (mode: 'none' | 'window' | 'page') => void;
    
    getFitMode: () => 'none' | 'window' | 'page';
    
    zoomIn: () => void;
    
    zoomOut: () => void;
}


export declare interface EditorAssetsOptions {
    
    proxy: HTTPProxy;
    
    resolver: EditorAssetsResolver;
    
    imageProcessing: EditorAssetsOssImageProcessing;
}


export declare interface EditorAssetsOssImageProcessing {
    
    compress: (imageUrl: string, compressOptions?: {
        quality?: number;
        maxWidth?: number;
        maxHeight?: number;
    }) => Promise<string>;
    
    crop: (imageUrl: string, cropOptions: {
        x?: number;
        y?: number;
        w: number;
        h: number;
        g?: EditorImageCropPoint;
    }) => Promise<string>;
}

export declare interface EditorAssetsResolver {
    
    resolveUrl: (assetId: string) => Promise<string | null>;
    
    parseId: (url: string) => Promise<string | null>;
    
    checkAssetReady: (assetId: string) => Promise<boolean> | boolean;
}


export declare interface EditorBrandOptions {
    
    content: Array<{
        type: 'image';
        src: string;
    } | {
        type: 'text';
        content: string;
        color?: string;
    }>;
    
    layout: {
        width: string;
        height: string;
    };
}


export declare interface EditorCommentItem {
    
    id: string;
    
    user: {
        id: string;
        name: string;
    };
    content: {
        text: string;
    };
}

export declare interface EditorComments {
    
    hasAny: () => Promise<boolean>;
    
    getAll: () => Promise<EditorCommentItem[]>;
    
    getOne: (commentId: string) => Promise<EditorCommentItem | null>;
    
    add: (options: {
        
        text: string;
        
        range?: string;
    }) => Promise<string | null>;
    
    deleteAll: () => Promise<boolean>;
    
    deleteOne: (commentId: string) => Promise<boolean>;
}


export declare interface EditorCommentsOptions {
    
    author?: {
        
        id: string;
        
        name: string;
        
        avatar?: string;
    };
    
    view?: {
        
        mode: 'none' | 'card';
    };
}

export declare interface EditorContent {
    
    setContent: (content: string | ArrayBuffer) => Promise<void>;
    
    getContent: () => Promise<EditorDelta>;
    
    addChangeListener: (listener: (change: EditorDelta) => void) => () => void;
}

export declare interface EditorDelta {
    compose: (other: EditorDelta, isDocument?: boolean) => EditorDelta;
    transform: (other: EditorDelta, priority?: boolean) => EditorDelta;
    stringify: () => string;
    length: number;
}


export declare interface EditorEmbeddedObject {
    
    url: string;
    
    type?: string;
    
    name?: string;
}


export declare interface EditorEmbeddedObjectOptions {
    
    open: (object: EditorEmbeddedObject) => Promise<boolean>;
    
    ui?: {
        
        preview?: {
            disabled?: boolean;
        };
        
        download?: {
            disabled?: boolean;
        };
    };
}

export declare interface EditorFontFace {
    
    name: string;
    
    family: string;
    
    url?: string;
    
    isCopyrightProtected: boolean;
    
    meta: EditorFontMeta;
}


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
    
    name: {
        preferredFamily?: Record<string, string>;
        preferredSubfamily?: Record<string, string>;
        fontFamily?: Record<string, string>;
        fontSubfamily?: Record<string, string>;
        fullName?: Record<string, string>;
        postScriptName?: Record<string, string>;
    };
}


export declare interface EditorFontsList {
    
    getAll: () => Promise<EditorFontFace[]>;
}

export declare interface EditorFontsOptions {
    
    list: EditorFontsList;
}


export declare interface EditorI18nOptions {
    
    language?: string;
    
    direction?: 'ltr' | 'rtl';
}

export declare type EditorImageCropPoint = 'nw' | 'north' | 'ne' | 'west' | 'center' | 'east' | 'sw' | 'south' | 'se';


export declare interface EditorLinkOptions {
    
    open: (url: string, target: string) => Promise<boolean>;
}


export declare type EditorMenuCustomButton = {
    
    name: string;
    
    type: 'link';
    
    text: string;
    
    url: string;
} | {
    
    name: string;
    
    type: 'button';
    
    label: string;
    
    icon?: string;
    
    callback: () => void;
};


export declare interface EditorMenuEntryButton {
    type: 'entry';
    
    name: string;
    
    icon?: string;
}


export declare interface EditorMenuEntryConfig<TName extends string> {
    
    name: string;
    
    children: Array<EditorMenuFeatureButton<TName> | EditorMenuEntryButton>[];
}


export declare type EditorMenuFeatureButton<TName extends string> = {
    
    type: 'hidden';
    
    name: TName;
} | {
    type: 'button';
    
    name: TName;
    
    label: string;
    
    icon?: string;
};


export declare type EditorMenuFeatureButtonConfig<TName extends string> = Record<TName, EditorMenuFeatureButton<TName>>;


export declare interface EditorMenuOptions<TName extends string> {
    
    visible?: boolean;
    
    disabled?: boolean;
    
    entries?: EditorMenuEntryConfig<TName>[];
    
    features?: Partial<EditorMenuFeatureButtonConfig<TName>>;
    
    custom?: EditorMenuCustomButton[];
}


export declare interface EditorMode {
    
    getModeType: () => EditorModeType;
    
    setStandardRole: (standardRole: EditorStandardRole) => Promise<void>;
    
    getStandardRole: () => EditorStandardRole;
}


export declare type EditorModeOptions = {
    type: 'standard';
    
    role?: EditorStandardRole;
} | {
    type: 'preview';
} | {
    type: 'presentation';
};


export declare type EditorModeType = 'standard' | 'preview' | 'presentation';


export declare interface EditorOptions {
    
    content: MaybePromiseValue<string | ArrayBuffer>;
    
    mode?: EditorModeOptions;
    
    user?: EditorUserOptions;
    
    i18n?: EditorI18nOptions;
    
    brand?: EditorBrandOptions;
    
    toolbar?: EditorToolbarOptions;
    
    assets?: EditorAssetsOptions;
    
    link?: EditorLinkOptions;
    
    embeddedObject?: EditorEmbeddedObjectOptions;
    
    watermark?: EditorWatermarkOptions;
    
    print?: EditorPrintOptions;
    
    comments?: EditorCommentsOptions;
}


export declare interface EditorOutline<Content = unknown> {
    
    setVisible: (visible: boolean) => void;
    
    getContent: () => Promise<EditorOutlineItem<Content>[]>;
    
    addChangedListener: (listener: (content: EditorOutlineItem<Content>[]) => void) => () => void;
    
    goto: (id: string) => Promise<boolean>;
}


export declare interface EditorOutlineItem<Content = unknown> {
    
    id: string;
    
    level: number;
    
    content: Content;
}


export declare interface EditorOutlineOptions {
    
    visible?: boolean;
}


export declare interface EditorPrintOptions {
    
    fallback?: {
        message: string;
    };
    
    disabled?: boolean;
}


export declare abstract class EditorSDK {
    protected options: EditorOptions;
    constructor(options: EditorOptions);
    
    abstract init(): Promise<void>;
    
    abstract destroy(): Promise<void>;
    
    abstract mount(root: HTMLElement): Promise<void>;
    
    abstract unmount(): Promise<void>;
    
    abstract get content(): EditorContent;
    
    abstract get mode(): EditorMode;
    
    abstract get comments(): EditorComments;
}


export declare type EditorStandardRole = 'editor' | 'viewer' | 'reviewer';


export declare interface EditorText<Color = string, TRangeValue = unknown> {
    
    get: (range?: TRangeValue) => Partial<EditorTextFormat<Color>>;
    
    apply: (format: Partial<EditorTextFormat<Color>>, range?: TRangeValue) => Partial<EditorTextFormat<Color>>;
    
    clear: (range: TRangeValue) => void;
}


export declare interface EditorTextFormat<Color = string> {
    
    bold: boolean;
    
    italic: boolean;
    
    underline: boolean;
    
    strike: boolean;
    
    color: Color;
    
    highlight: Color;
    
    size: number | string;
    
    family: string;
}


export declare interface EditorTextOptions<Color = string> {
    
    defaultFormat?: Partial<EditorTextFormat<Color>>;
}


export declare interface EditorToolbarCustomButton extends Omit<EditorToolbarFeatureButton, 'name'> {
    
    name: string;
    
    callback: () => void;
    
    index?: number;
}


export declare interface EditorToolbarCustomButtonConfig {
    
    [key: string]: EditorToolbarCustomButton;
}


export declare interface EditorToolbarFeatureButton {
    
    name: EditorToolbarFeatureButtonName;
    
    label?: string;
    
    icon?: string;
    
    disabled?: boolean;
    
    tooltip?: string;
}


export declare type EditorToolbarFeatureButtonConfig = {
    [key in EditorToolbarFeatureButtonName]?: EditorToolbarFeatureButton;
};


export declare type EditorToolbarFeatureButtonName = 

'bold'

| 'italic'

| 'underline'

| 'strikethrough'

| 'insertImage'

| 'insertLink'

| 'restriction';


export declare interface EditorToolbarOptions {
    
    visible?: boolean;
    
    disabled?: boolean;
    
    features?: EditorToolbarFeatureButtonConfig;
    
    custom?: EditorToolbarCustomButtonConfig;
}


export declare interface EditorUserOptions {
    
    uid: string;
    
    name: string;
    
    avatar?: string;
}


export declare interface EditorWatermarkOptions {
    
    getWatermark: () => MaybePromiseValue<EditorWatermarkResource | null>;
    
    required?: boolean;
}

export declare type EditorWatermarkResource = {
    type: 'data-url';
    url: string;
} | {
    type: 'object-url';
    url: string;
};


export declare type HTTPHeaders = Record<string, string | number | boolean | undefined>;


export declare type HTTPMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';


export declare interface HTTPProxy {
    
    request: <D = unknown, T = unknown>(config: HTTPRequestConfig<D>) => Promise<HTTPResponse<T>>;
    
    interceptors?: {
        request?: {
            
            intercept: <D = unknown>(requestConfig: HTTPRequestConfig<D>) => HTTPRequestConfig<D>;
        };
        response?: {
            
            intercept: <T = unknown>(response: HTTPResponse<T>) => HTTPResponse<T>;
        };
    };
    
    create: (id: string) => Promise<HTTPProxy>;
}


export declare interface HTTPRequestConfig<Data = unknown> {
    
    url: string;
    
    method?: HTTPMethod;
    
    data?: Data;
    
    responseType?: HTTPResponseType;
    
    headers?: HTTPHeaders;
}


export declare interface HTTPResponse<Data = unknown> {
    
    data: Data;
    
    status: number;
    
    headers: HTTPHeaders;
}


export declare type HTTPResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export declare type MaybePromiseValue<T> = T | Promise<T>;


export declare type PdfMenuEntryConfig = EditorMenuEntryConfig<PdfMenuFeatureButtonName>;


export declare type PdfMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<PdfMenuFeatureButtonName>;


export declare type PdfMenuFeatureButtonName = 'selectAll';

export declare type PdfMenuOptions = EditorMenuOptions<PdfMenuFeatureButtonName>;


export declare type PdfOutline = EditorOutline<{
    text: string;
}>;


export declare type PdfOutlineItem = EditorOutlineItem<{
    text: string;
}>;

export declare type PdfOutlineOptions = EditorOutlineOptions;


export declare interface PdfPage {
    
    readonly pageNumber: number;
    
    getPageSize: () => {
        width: number;
        height: number;
    };
}


export declare interface PdfPages {
    
    getCurrentPageNumber: () => number;
    
    setCurrentPage: (page: number) => void;
    
    getPagesCount: () => number;
    
    getPage: (page: number) => Promise<PdfPage | null>;
}



export declare interface PdfRange {
    
    readonly start: string;
    
    readonly end: string;
    
    getText: () => string;
    
    getHtml: () => string;
    
    getBounding: () => PdfRangeBounding | null;
}


export declare interface PdfRangeBounding {
    
    top: number;
    
    right: number;
    
    bottom: number;
    
    left: number;
    
    start: number;
    
    end: number;
}

export declare interface PdfRangeValue {
    start: string;
    end: string;
}


export declare interface PdfSDKOptions {
    
    content: MaybePromiseValue<string | ArrayBuffer>;
    
    user?: EditorUserOptions;
    
    i18n?: EditorI18nOptions;
    
    brand?: EditorBrandOptions;
    
    assets?: EditorAssetsOptions;
    
    link?: EditorLinkOptions;
    
    watermark?: EditorWatermarkOptions;
    
    print?: EditorPrintOptions;
    
    outline?: PdfOutlineOptions;
    
    menu?: PdfMenuOptions;
}


export declare interface PdfSelection {
    
    getRange: (value?: PdfRangeValue) => PdfRange | null;
    
    setRange: (vale: PdfRangeValue | null) => void;
    
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


export declare type PresentationMenuEntryConfig = EditorMenuEntryConfig<PresentationMenuFeatureButtonName>;


export declare type PresentationMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<PresentationMenuFeatureButtonName>;


export declare type PresentationMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll';

export declare type PresentationMenuOptions = EditorMenuOptions<PresentationMenuFeatureButtonName>;

export declare interface PresentationSDKOptions extends EditorOptions {
    
    fonts?: PresentationFontsOptions;
    
    menu?: PresentationMenuOptions;
    
    text?: PresentationTextOptions;
}


export declare interface PresentationSelection {
    
    getTextRange: (value?: PresentationTextRangeValue) => PresentationTextRange | null;
    
    setTextRange: (value: PresentationTextRangeValue | null) => void;
    
    getSelectedShapes: (ids?: string[]) => PresentationShape[] | null;
    
    setSelectedShapes: (ids: string[] | null) => void;
    
    addRangeListener: (listener: (value: PresentationTextRangeValue | null) => void) => void;
}


export declare interface PresentationShape {
    
    readonly id: string;
}


export declare interface PresentationSlide {
    
    readonly id: string;
    
    getIndex: () => number;
    
    getShapes: () => PresentationShape[];
}


export declare interface PresentationSlides {
    
    getCurrentSlide: () => PresentationSlide;
    
    setCurrentSlideIndex: (slideId: string) => void;
    
    getSlideIndex: (slideId: string) => number;
    
    getSlidesCount: () => number;
    
    getSlides: () => PresentationSlide[];
    
    getSlideById: (slideId: string) => PresentationSlide;
    
    getSelectedSlides: (ids?: string[]) => PresentationSlide[];
    
    setSelectedSlides: (ids: string[]) => void;
}


export declare type PresentationText = EditorText<string, PresentationTextRangeValue>;


export declare type PresentationTextFormat = EditorTextFormat;


export declare type PresentationTextOptions = EditorTextOptions<string>;



export declare interface PresentationTextRange {
    
    readonly start: string;
    
    readonly end: string;
    
    getText: () => string;
    
    setText: (text: string) => void;
    
    getHtml: () => string;
    
    setHtml: (html: string) => void;
}

export declare interface PresentationTextRangeValue {
    start: string;
    end: string;
}


export declare interface PresentationZoom {
    
    getPercentage: () => number;
    
    setPercentage: (percentage: number) => void;
    
    setFitMode: (mode: 'none' | 'window') => void;
    
    getFitMode: () => 'none' | 'window';
    
    zoomIn: () => void;
    
    zoomOut: () => void;
}


export declare interface SheetCell {
    
    row: number;
    
    column: number;
    
    sheetId: string;
    
    getCellText: () => string;
    
    getCellValue: () => SheetCellValue | null;
}


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


export declare type SheetMenuEntryConfig = EditorMenuEntryConfig<SheetMenuFeatureButtonName>;


export declare type SheetMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<SheetMenuFeatureButtonName>;


export declare type SheetMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll';

export declare type SheetMenuOptions = EditorMenuOptions<SheetMenuFeatureButtonName>;


export declare interface SheetRange {
    
    type: `${SheetRangeType}`;
    
    readonly row: number;
    
    readonly column: number;
    
    readonly rowCount: number;
    
    readonly columnCount: number;
    
    getText: () => string;
    
    setText: (text: string) => void;
    
    getHtml: () => string;
    
    setHtml: (html: string) => void;
}



export declare enum SheetRangeType {
    
    Cells = "cells",
    
    Rows = "rows",
    
    Columns = "columns",
    
    Sheet = "sheet"
}

export declare type SheetRangeValue = {
    
    type: `${SheetRangeType.Cells}`;
    
    row: number;
    
    rowCount: number;
    
    column: number;
    
    columnCount: number;
} | {
    
    type: `${SheetRangeType.Rows}`;
    
    row: number;
    
    rowCount: number;
} | {
    
    type: `${SheetRangeType.Columns}`;
    
    column: number;
    
    columnCount: number;
} | {
    
    type: `${SheetRangeType.Sheet}`;
};

export declare interface SheetSDKOptions extends EditorOptions {
    
    fonts?: EditorFontsOptions;
    
    menu?: SheetMenuOptions;
    
    text?: SheetTextOptions;
}


export declare interface SheetSelection {
    
    getRange: (value?: SheetRangeValue) => SheetRange | null;
    
    setRange: (value: SheetRangeValue | null) => void;
}


export declare type SheetText = EditorText<string, SheetRangeValue>;


export declare type SheetTextFormat = EditorTextFormat;


export declare type SheetTextOptions = EditorTextOptions<string>;


export declare interface SheetWorkbook {
    
    getWorksheets: () => SheetWorksheet[];
    
    getWorksheetById: (sheetId: string) => SheetWorksheet | null;
    
    getActiveWorksheet: () => SheetWorksheet;
    
    setActiveWorksheet: (sheetId: string) => void;
}


export declare interface SheetWorksheet {
    
    get id(): string;
    
    get name(): string;
    
    get isActive(): boolean;
    
    getSelections: () => SheetSelection[] | null;
    
    getPhysicalPosition: (range: SheetRangeValue) => {
        left: number;
        top: number;
        width: number;
        height: number;
    } | null;
    
    addRangeListener: (listener: (range: {
        sheet: string;
        ranges: SheetRangeValue[] | null;
    }) => void) => () => void;
    
    getCell: (row: number, column: number) => SheetCell | null;
    
    getActiveCell: () => SheetCell | null;
    
    setActiveCell: (cell: {
        row: number;
        column: number;
    }) => void;
    
    locateCell: (row: number, column: number) => void;
}

export { }

