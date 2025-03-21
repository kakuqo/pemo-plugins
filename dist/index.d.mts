import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

interface IPlugin {
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
}
interface ChatOptions {
    prompt?: string;
    modelName: string;
    temperature?: number;
    historyMessages?: Message[];
    query: string;
    context?: string;
    filePaths?: string[];
    embeddings?: {
        text: string;
        filePath: string;
    }[];
    topK?: number;
    topP?: number;
    onChunk?: (chunk: string) => void;
    signalId?: string;
}
interface EmbeddingOptions {
    text?: string;
    filePaths?: string[];
    modelName: string;
    signalId?: string;
    id?: string;
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
    main: string;
    downloadUrl?: string;
    platforms: Platform[];
    arch: Architecture[];
    icon: string;
    link: string;
    author: string;
    homepage: string;
    source: string;
    importType: ImportType;
    provider: PluginProvider;
    features: string[];
    configuration: PluginConfiguration[];
    models: PluginModel[];
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

interface PluginManagerConfig {
    pluginRegistry: string;
    pluginDir: string;
    autoUpdate: boolean;
    maxConcurrent: number;
    timeout: number;
    buildInPluginDir?: string;
    logger?: {
        error: (message: string) => void;
    };
}
interface PluginEventListeners {
    onInstall: (pluginId: string) => void;
    onUninstall: (pluginId: string) => void;
}
interface InstallOptions {
    force?: boolean;
}
declare class PluginError extends Error {
    pluginId: string;
    code: string;
    originalError?: any | undefined;
    constructor(pluginId: string, code: string, message: string, originalError?: any | undefined);
}
interface IPluginManager {
    getPlugins(): Map<string, IPlugin>;
    getPluginsConfig(): Promise<Map<string, any>>;
    loadPlugin(pluginId: string): Promise<any>;
    getAvailablePlugins(url: string, options: {
        httpAgent?: HttpsProxyAgent<string> | SocksProxyAgent;
    }): Promise<PluginManifest[]>;
    installFromPemox(pemoxPath: string, options?: InstallOptions): Promise<void>;
    installMultipleFromPemox(pemoxPaths: string[], options?: InstallOptions): Promise<void>;
    installFromOnline(pluginManifest: PluginManifest, options?: InstallOptions): Promise<void>;
    uninstallPlugin(pluginId: string): Promise<void>;
    getPluginConfig<T = any>(pluginId: string): Promise<T>;
    setPluginConfig<T = any>(pluginId: string, config: T): Promise<void>;
    updatePlugin(pluginId: string): Promise<void>;
    addEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
    removeEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
}
interface AgentInfo {
    id: string;
    name: string;
    description: string;
    category: string;
    avatar: string;
    author: string;
    capabilities: string[];
}

declare class PluginManager implements IPluginManager {
    private plugins;
    private pluginsConfig;
    private uninstallPlugins;
    private agentInfo;
    private config;
    private eventListeners;
    private defaultTimeout;
    constructor(config: Partial<PluginManagerConfig>);
    private init;
    getPlugins(): Map<string, IPlugin>;
    getPluginsConfig(): Promise<Map<string, any>>;
    getAgentInfo(): Promise<AgentInfo[]>;
    getUninstallPlugins(): Promise<Map<string, string>>;
    private _loadAgentInfo;
    private _loadBuildInPlugins;
    private _loadPluginsConfig;
    loadPlugin(pluginId: string): Promise<any>;
    private _loadAndRegisterPlugin;
    getAvailablePlugins(url: string, { httpAgent }: {
        httpAgent?: HttpsProxyAgent<string> | SocksProxyAgent;
    }): Promise<PluginManifest[]>;
    installFromPemox(pemoxPath: string, options?: InstallOptions): Promise<void>;
    installMultipleFromPemox(pemoxPaths: string[], options?: InstallOptions): Promise<void>;
    installFromOnline(pluginManifest: PluginManifest, options?: InstallOptions): Promise<void>;
    uninstallPlugin(pluginId: string): Promise<void>;
    getPluginConfig<T = any>(pluginId: string): Promise<T>;
    setPluginConfig<T = any>(pluginId: string, config: T): Promise<void>;
    updatePlugin(pluginId: string): Promise<void>;
    private emitEvent;
    addEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
    removeEventListener(type: keyof PluginEventListeners, listener: (pluginId: string) => void): void;
}

export { type AgentInfo, type Architecture, type ChatOptions, type EmbeddingOptions, type EmbeddingResults, type IPlugin, type IPluginManager, type ImportType, type InstallOptions, type Message, type MindMapOptions, type Platform, type PluginConfig, type PluginConfiguration, PluginError, type PluginEventListeners, type PluginManagerConfig, type PluginManifest, type PluginModel, type PluginProvider, type PluginRequest, type PluginResponse, type ProgressCallback, type SummarizeOptions, type TranslationInput, type TranslationOptions, PluginManager as default };
