import { Handlers } from "$fresh/server.ts";
import { getOfflineFormPb } from "../../../../../../controllers/pb/get-offline-form.ts";

export const handler: Handlers = {
  async GET(req, ctx): Promise<Response> {
    const link = ctx.params.link;
    const url = new URL(req.url);
    const category = url.searchParams.get('category') ?? '';
    console.log(link, category);
    const pdf = await getOfflineFormPb(link, category);
    if (pdf == null) {
      return new Response(JSON.stringify({payload: null}));
    }
    return new Response(pdf);
  },
};