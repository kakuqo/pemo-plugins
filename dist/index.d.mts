interface IPlugin {
    getName(): string;
    getConfig(): any;
    setConfig(config: any): void;
    getVersion(): string;
    init(): void | Promise<void>;
    start(): void | Promise<void>;
    stop(): void | Promise<void>;
    validateConfig(): boolean;
}

interface PluginMetadata {
    name: string;
    version: string;
    description: string;
    author: string;
    repository: string;
    main: string;
    dependencies?: Record<string, string>;
    config?: Record<string, any>;
}
interface PluginPackage {
    metadata: PluginMetadata;
    downloadUrl: string;
    sha256?: string;
    isOfficial: boolean;
    downloads: number;
    rating: number;
    lastUpdated: Date;
}
interface PluginInstallation {
    metadata: PluginMetadata;
    installPath: string;
    installedAt: Date;
    lastUsed?: Date;
    usageCount: number;
    enabled: boolean;
}

interface InstallOptions {
    force?: boolean;
    skipDependencies?: boolean;
    config?: Record<string, any>;
}
interface UpdateOptions {
    keepConfig?: boolean;
    backup?: boolean;
}
interface PluginEventListeners {
    onInstall?: (pluginName: string) => void | Promise<void>;
    onUninstall?: (pluginName: string) => void | Promise<void>;
    onEnable?: (pluginName: string) => void | Promise<void>;
    onDisable?: (pluginName: string) => void | Promise<void>;
    onError?: (pluginName: string, error: Error) => void | Promise<void>;
}
interface PluginManagerConfig {
    pluginRegistry: string;
    pluginDir: string;
    buildInPluginDir?: string;
    autoUpdate?: boolean;
    maxConcurrent?: number;
    timeout?: number;
    proxy?: string;
    logger?: {
        info: (message: string) => void;
        error: (message: string) => void;
        warn: (message: string) => void;
        debug: (message: string) => void;
    };
    security?: {
        validateChecksum: boolean;
        allowUnsigned: boolean;
        trustedAuthors: string[];
    };
    storage?: {
        type: 'file' | 'memory' | 'custom';
        path?: string;
        custom?: any;
    };
}
declare class PluginError extends Error {
    readonly pluginName: string;
    readonly code: string;
    readonly originalError?: Error | undefined;
    constructor(pluginName: string, code: string, message: string, originalError?: Error | undefined);
}
declare enum PluginStatus {
    INSTALLED = "installed",
    ENABLED = "enabled",
    DISABLED = "disabled",
    ERROR = "error",
    UPDATING = "updating",
    UNINSTALLING = "uninstalling",
    NOT_INSTALLED = "not_installed"
}

declare class PluginManager {
    private plugins;
    private pluginsConfig;
    private installations;
    private config;
    private eventListeners;
    private defaultTimeout;
    private errors;
    constructor(config: Partial<PluginManagerConfig>);
    private init;
    getPlugins(): Map<string, IPlugin>;
    getPluginsConfig(): Promise<Map<string, any>>;
    private _loadBuildInPlugins;
    private _loadPluginsConfig;
    loadPlugin(pluginId: string): Promise<any>;
    private _loadAndRegisterPlugin;
    getConfig(): PluginManagerConfig;
    setConfig(config: Partial<PluginManagerConfig>): void;
    getAvailablePlugins(): Promise<PluginPackage[]>;
    searchPlugins(query: string): Promise<PluginPackage[]>;
    getPluginDetails(pluginName: string): Promise<PluginPackage | null>;
    installPlugin(pluginPackage: PluginPackage, options?: InstallOptions): Promise<void>;
    uninstallPlugin(name: string): Promise<void>;
    updatePlugin(name: string, options?: UpdateOptions): Promise<void>;
    getPluginStatus(name: string): PluginStatus;
    findPlugin(predicate: (plugin: IPlugin) => boolean): IPlugin | undefined;
    getPluginConfig<T = any>(pluginName: string): Promise<T>;
    setPluginConfig<T = any>(pluginName: string, config: T): Promise<void>;
    resetPluginConfig(pluginName: string): Promise<void>;
    installMultiplePlugins(plugins: PluginPackage[], options?: InstallOptions): Promise<void>;
    uninstallMultiplePlugins(pluginNames: string[]): Promise<void>;
    enableMultiplePlugins(pluginNames: string[]): Promise<void>;
    disableMultiplePlugins(pluginNames: string[]): Promise<void>;
    refreshRegistry(): Promise<void>;
    registerPlugin(plugin: IPlugin): Promise<void>;
    unregisterPlugin(name: string): Promise<void>;
    validateDependencies(name: string): Promise<boolean>;
    createPluginDirectory(name: string): Promise<string>;
    cleanupPluginDirectory(name: string): Promise<void>;
    handleError(error: Error, pluginName?: string): void;
    getLastError(pluginName: string): PluginError | null;
    updateUsageStats(name: string): void;
    getPluginStats(name: string): {
        usageCount: number;
        lastUsed: Date | undefined;
        errors: PluginError[];
        performance: {
            loadTime: number;
            memoryUsage: number;
        };
    };
    cleanup(): Promise<void>;
    backup(name: string): Promise<string>;
    verify(): Promise<boolean>;
    getPluginPath(name: string): string;
    isValidPluginName(name: string): boolean;
    generatePluginId(name: string, version: string): string;
    getPlugin<T extends IPlugin>(name: string): T;
    getInstalledPlugins(): PluginInstallation[];
    setPluginEnabled(name: string, enabled: boolean): Promise<void>;
    isPluginEnabled(name: string): boolean;
    addEventListener(type: keyof PluginEventListeners, listener: Function): void;
    removeEventListener(type: keyof PluginEventListeners, listener: Function): void;
    private emitEvent;
}

export { PluginManager as default };
