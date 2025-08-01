import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

interface IPlugin {
    getInstance(config: any): IPlugin;
    getMaxTokens(modelName: string, isEmbedding?: boolean): number;
    getMaxOutputTokens(modelName: string): number;
    modelLists(): Promise<string[]>;
    translate(options: TranslationOptions & {
        signalId?: string;
    }): Promise<TranslationInput[]>;
    summarize(options: SummarizeOptions): Promise<string>;
    generateMindMap(options: MindMapOptions): Promise<string>;
    chat(options: ChatOptions): Promise<string>;
    embedding(options: EmbeddingOptions): Promise<EmbeddingResults[] | null>;
    cancelRequest(operationType: string, id?: string): boolean;
    cancelAllRequests(): void;
    cancelProcess(processId: string): boolean;
    cancelAllProcesses(): void;
    checkService(): Promise<boolean>;
    stopService(): Promise<boolean>;
    startService(): Promise<{
        success: boolean;
        message?: string;
    }>;
    synthesize(options: TTSOptions): Promise<string>;
    transcript(args: string[], options: WhisperOptions): Promise<any>;
}
interface ProgressCallback {
    current: number;
    total: number;
    status: string;
}
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
interface SummarizeOptions {
    text?: string;
    filePath?: string;
    modelName: string;
    prompt?: string;
    onChunk?: (chunk: string) => void;
    onProgress?: (progress: ProgressCallback) => void;
    signalId?: string;
    config?: {
        [key: string]: any;
    };
}
interface MindMapOptions {
    text?: string;
    filePath?: string;
    modelName: string;
    prompt?: string;
    onChunk?: (chunk: string) => void;
    onProgress?: (progress: ProgressCallback) => void;
    httpAgent?: any;
    signalId?: string;
    config?: {
        [key: string]: any;
    };
}
interface ChatOptions {
    prompt?: string;
    modelName: string;
    temperature?: number;
    historyMessages?: {
        role: 'user' | 'assistant' | 'system';
        content: string;
    }[];
    query: string;
    contexts?: string[];
    files?: {
        filePath: string;
        fileName: string;
    }[];
    embeddings?: {
        text: string;
        fileName: string;
    }[];
    topK?: number;
    topP?: number;
    onChunk?: (chunk: string) => void;
    signalId?: string;
    config?: {
        [key: string]: any;
    };
}
interface EmbeddingOptions {
    text?: string;
    files?: {
        filePath: string;
        fileName: string;
    }[];
    modelName: string;
    signalId?: string;
    config?: {
        [key: string]: any;
    };
}
interface EmbeddingResults {
    text: string;
    embedding: number[];
    type: 'text' | 'file';
    metadata?: Record<string, any>;
}
interface TranslationInput {
    text: string;
}
interface TranslationOptions {
    modelName?: string;
    targetLanguage: string;
    formLanguage?: string;
    inputs: TranslationInput[];
    style?: 'formal' | 'casual';
    domain?: string;
    preserveFormatting?: boolean;
    glossary?: Record<string, string>;
    signalId?: string;
}
interface TTSOptions {
    text: string;
    outputPath?: string;
    outputDir?: string;
    voice?: string;
    speed?: number;
    pitch?: number;
    language?: string;
    format?: 'audio-16khz-32kbitrate-mono-mp3' | 'audio-24khz-48kbitrate-mono-mp3' | 'audio-48khz-96kbitrate-mono-mp3' | 'audio-48khz-192kbitrate-mono-mp3' | 'riff-16khz-16bit-mono-pcm' | 'riff-24khz-16bit-mono-pcm' | 'riff-48khz-16bit-mono-pcm' | 'webm-16khz-16bit-mono-opus' | 'webm-24khz-16bit-mono-opus';
    sampleRate?: 16000 | 24000 | 48000;
    fileFormat?: 'mp3' | 'wav' | 'webm' | 'opus';
    signalId?: string;
    httpAgent?: string;
    onProgress?: (progress: {
        stage: string;
        message: string;
    }) => void;
    onError?: (error: string) => void;
}
type Platform = 'win32' | 'darwin' | 'linux';
type Architecture = 'arm64' | 'x64' | 'x86';
type ImportType = 'module' | 'commonjs';
interface PluginProvider {
    value: string;
    label: string;
}
interface PluginConfiguration {
    label: string;
    key: string;
    type: 'input' | 'select' | 'checkbox' | 'radio';
    required?: boolean;
    placeholder?: string;
    description: string;
    defaultValue?: string | number | boolean;
    options?: Array<{
        label: string;
        value: string | number | boolean;
    }>;
}
type AbortType = 'chat' | 'embedding' | 'translate' | 'summary' | 'mindmap';
interface PluginModel {
    label: string;
    value: string;
    maxTokens: number;
    maxOutputTokens: number;
    type: 'chat' | 'completion' | 'embedding';
}
interface PluginManifest {
    version: string;
    title: string;
    description: string;
    pluginId: string;
    category: string;
    categoryName: string;
    main: string;
    downloadUrl?: string;
    componentPath?: string;
    pluginDir?: string;
    platforms: Platform[];
    arch: Architecture[];
    localIcon?: string;
    icon: string;
    link: string;
    macLink?: string;
    winLink?: string;
    author: string;
    homepage: string;
    source: string;
    importType: ImportType;
    provider: PluginProvider;
    features: string[];
    configuration: PluginConfiguration[];
    models: PluginModel[];
    voices?: {
        label: string;
        value: string;
    }[];
    fileHash?: string;
    macFileHash?: string;
    winFileHash?: string;
    forceUpdate?: boolean;
}
interface PluginConfig {
    [key: string]: string | number | boolean | undefined;
}
interface PluginResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
interface PluginRequest {
    model?: string;
    config?: PluginConfig;
    [key: string]: any;
}
interface WhisperOptions {
    uuid: string;
    onSegment?: (segment: any) => void;
    onError?: (error: any) => void;
    onSuccess?: (transcription: any) => void;
}

interface PluginManagerConfig {
    pluginRegistry: string;
    pluginDir: string;
    autoUpdate: boolean;
    maxConcurrent: number;
    timeout: number;
    buildInPluginDir?: string;
    pluginListUrl: string;
    agent?: HttpsProxyAgent<string> | SocksProxyAgent | undefined;
    logger?: {
        error: (message: string) => void;
    };
}
interface PluginEventListeners {
    onInstall: (pluginId: string) => void;
    onUninstall: (pluginId: string) => void;
    onPluginLoad: (pluginId: string) => void;
    onPluginUpdate: (pluginId: string, oldVersion?: string, newVersion?: string) => void;
    onComponentLoad: (pluginId: string) => void;
    onComponentUnload: (pluginId: string) => void;
    onDownloadStart: (pluginId: string, url: string) => void;
    onDownloadComplete: (pluginId: string, filePath: string) => void;
    onDownloadError: (pluginId: string, error: string) => void;
    onPluginError: (pluginId: string, error: string) => void;
}
interface InstallOptions {
    force?: boolean;
    agent?: HttpsProxyAgent<string> | SocksProxyAgent;
    progressCallback?: ({ progress, pluginId }: {
        progress: number;
        pluginId: string;
    }) => void;
    downloadFile?: (options: {
        url: string;
        savePath: string;
        startCallback?: () => void;
        progressCallback?: ({ progress, pluginId }: {
            progress: number;
            pluginId: string;
        }) => void;
        completionCallback?: (localPath: string) => void;
        errorCallback?: (error: any) => void;
        agent?: HttpsProxyAgent<string> | SocksProxyAgent | undefined;
        abortController?: AbortController;
    }) => {
        cancel: () => void;
    };
    zipFileFunction?: (zipFilePath: string, outputFolderPath: string, callback?: any) => Promise<void>;
}
declare class PluginError extends Error {
    pluginId: string;
    code: string;
    originalError?: any | undefined;
    constructor(pluginId: string, code: string, message: string, originalError?: any | undefined);
}
interface IPluginManager {
    getPlugins(): Map<string, IPlugin>;
    getPluginsConfig(): Promise<Map<string, PluginManifest>>;
    getAgentInfo(): Promise<AgentConfig | null>;
    loadPlugin(pluginId: string): Promise<IPlugin>;
    getAvailablePlugins(url: string, options: {
        httpAgent?: HttpsProxyAgent<string> | SocksProxyAgent;
    }): Promise<PluginManifest[]>;
    installFromPemox(pemoxPath: string, options?: InstallOptions): Promise<any>;
    installMultipleFromPemox(pemoxPaths: string[], options?: InstallOptions): Promise<void>;
    installFromOnline(pluginManifest: PluginManifest, options?: InstallOptions): Promise<{
        success: boolean;
        pluginsConfig?: Map<string, PluginManifest>;
        error?: string;
        cancel?: () => void;
    }>;
    cancelDownload(pluginId: string): boolean;
    cancelAllDownloads(): void;
    uninstallPlugin(pluginId: string): Promise<{
        success: boolean;
        pluginsConfig: Map<string, PluginManifest>;
    }>;
    getUninstallPlugins(): Promise<Map<string, PluginManifest>>;
    getPluginConfig(pluginId: string): Promise<PluginManifest>;
    setPluginConfig(pluginId: string, config: PluginManifest): Promise<void>;
    setAgentConfig(config: AgentConfig): Promise<AgentConfig>;
    loadPluginComponent(pluginId: string, containerId: string, componentName?: string): Promise<any>;
    unloadPluginComponent(pluginId: string, containerId: string): Promise<void>;
    reloadPluginComponent(pluginId: string, containerId: string, componentName?: string): Promise<any>;
    addEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
    removeEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
}
interface AgentConfig {
    id: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    agents: AgentInfo[];
}
interface AgentInfo {
    id: string;
    name: string;
    description?: string;
    category?: string;
    author?: string;
    capabilities?: string[];
    createdAt?: string;
    updatedAt?: string;
    version?: string;
}

declare class PluginManager implements IPluginManager {
    private plugins;
    private pluginsConfig;
    private uninstallPlugins;
    private agentInfo;
    private config;
    private eventListeners;
    private defaultTimeout;
    private downloadAbortControllers;
    constructor(config: Partial<PluginManagerConfig>);
    private init;
    getPlugins(): Map<string, IPlugin>;
    getPluginsConfig(): Promise<Map<string, any>>;
    getAgentInfo(): Promise<AgentConfig | null>;
    getUninstallPlugins(): Promise<Map<string, PluginManifest>>;
    private _loadAgentInfo;
    private _loadBuildInPlugins;
    private _loadForceOnlinePlugins;
    private _loadPluginsConfig;
    loadPlugin(pluginId: string): Promise<any>;
    loadPluginComponent(pluginId: string, containerId: string, componentName?: string): Promise<any>;
    private _loadComponentScript;
    unloadPluginComponent(pluginId: string, containerId: string): Promise<void>;
    reloadPluginComponent(pluginId: string, containerId: string, componentName?: string): Promise<any>;
    private _loadAndRegisterPlugin;
    getAvailablePlugins(url: string, options?: {
        httpAgent?: HttpsProxyAgent<string> | SocksProxyAgent | undefined;
    }): Promise<PluginManifest[]>;
    installFromPemox(pemoxPath: string, options?: InstallOptions): Promise<any>;
    installMultipleFromPemox(pemoxPaths: string[], options?: InstallOptions): Promise<void>;
    installFromOnline(pluginManifest: PluginManifest, options?: InstallOptions): Promise<{
        success: boolean;
        pluginsConfig?: Map<string, PluginManifest>;
        error?: string;
        cancel?: () => void;
    }>;
    private removeOldPlugin;
    uninstallPlugin(pluginId: string): Promise<{
        success: boolean;
        pluginsConfig: Map<string, PluginManifest>;
    }>;
    getPluginConfig<T = any>(pluginId: string): Promise<T>;
    setPluginConfig(pluginId: string, config: PluginManifest): Promise<void>;
    setAgentConfig(config: AgentConfig): Promise<AgentConfig>;
    private emitEvent;
    addEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
    removeEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
    cancelDownload(pluginId: string): boolean;
    private cleanupDownloadFiles;
    private cleanupPluginDownloadFiles;
    private cleanupAllDownloadFiles;
    cancelAllDownloads(): void;
}

export { type AbortType, type AgentConfig, type AgentInfo, type Architecture, type ChatOptions, type EmbeddingOptions, type EmbeddingResults, type IPlugin, type IPluginManager, type ImportType, type InstallOptions, type Message, type MindMapOptions, type Platform, type PluginConfig, type PluginConfiguration, PluginError, type PluginEventListeners, type PluginManagerConfig, type PluginManifest, type PluginModel, type PluginProvider, type PluginRequest, type PluginResponse, type ProgressCallback, type SummarizeOptions, type TTSOptions, type TranslationInput, type TranslationOptions, type WhisperOptions, PluginManager as default };
