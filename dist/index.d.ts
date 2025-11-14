import { Plugin } from 'vite';

interface KbsDslParserOptions {
    compress?: boolean;
    ignoreFNames?: string[];
    watch?: boolean;
    watchOptions?: {
        protocol?: 'ws';
        host?: string;
        port?: number;
    };
    test?: (id: string) => boolean;
    injectHtmlAttribute?: boolean;
}
declare function kbsDslParser(options?: KbsDslParserOptions): Plugin;

export { type KbsDslParserOptions, kbsDslParser as default, kbsDslParser };
