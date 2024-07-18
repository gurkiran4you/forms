import { Handlers } from "$fresh/server.ts";
import { getPbFormTypes } from "../../../../../controllers/pb/get-form-types/types.ts";
import { getOfflineFormPb } from "../../../../../controllers/pb/get-offline-form.ts";

export const handler: Handlers = {
  async GET(req, ctx): Promise<Response> {
    const link = ctx.params.link;
    const url = new URL(req.url);
    const categoryId = url.searchParams.get('category') ?? '';
    const allPbFormTypes = await getPbFormTypes() ?? [];
    const categoryType = allPbFormTypes.find(type => type.id === categoryId);
    if (categoryType == null) {
      return ctx.render(); // 404
    }
    const file = await getOfflineFormPb(link, categoryType.title);
    if (file == null) {
      return new Response(JSON.stringify({payload: null}));
    }
    if (link.includes('.mp3')) {
      return new Response(file, {
        headers: {
          'Content-Type': 'audio/mpeg'
        }
      })
    }
    return new Response(file);
  },
};