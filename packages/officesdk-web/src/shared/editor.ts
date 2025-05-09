
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

export { }

