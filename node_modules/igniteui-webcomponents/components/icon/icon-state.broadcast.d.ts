import type { BroadcastIconsChangeMessage, IconMeta, IconsCollection, SvgIcon } from './registry/types.js';
export declare class IconsStateBroadcast {
    private channel;
    private collections;
    private refsCollection;
    private static readonly origin;
    constructor(collections: IconsCollection<SvgIcon>, refsCollection: IconsCollection<IconMeta>);
    send(data: BroadcastIconsChangeMessage): void;
    handleEvent({ data }: MessageEvent<BroadcastIconsChangeMessage>): void;
    private create;
    private dispose;
    private getUserRefsCollection;
    private getUserSetCollection;
}
