import type { AnswerParams, NavigateParams, CreatePageParams, UpdatePageParams, DeletePageParams } from "./actions.js";
export interface SurfaceHandlers {
    /** Commit a decision. Familiar: send `[ask:<id>] <json>` through chat. Nozio: write page data. */
    answer: (params: AnswerParams) => void | Promise<void>;
    /** Go to an internal route. Wire to the surface's router. */
    navigate: (params: NavigateParams) => void | Promise<void>;
    /** Create a page/row in a database. Nozio: documents.create (+ updateProperties). */
    createPage: (params: CreatePageParams) => void | Promise<void>;
    /** Edit a page's title/properties, shallow-merged. Nozio: documents.update / updateProperties. */
    updatePage: (params: UpdatePageParams) => void | Promise<void>;
    /** Archive a page — recoverable, never a hard delete. Nozio: documents.archive. */
    deletePage: (params: DeletePageParams) => void | Promise<void>;
}
export declare function createRegistry(handlers: SurfaceHandlers): import("@json-render/react").DefineRegistryResult;
/**
 * A registry for display-only surfaces (previews, exports) where no handler makes sense.
 * Interactions warn instead of throwing — a preview must not crash on a stray click.
 */
export declare const displayRegistry: import("@json-render/react").ComponentRegistry;
