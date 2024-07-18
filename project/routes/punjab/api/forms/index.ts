import { Handlers } from "$fresh/server.ts";
import { getPbCategoryTitles } from "../../../../controllers/pb/get-dropdown-data/category-titles.ts";
import { getPbFormsForTitle } from "../../../../controllers/pb/get-dropdown-data/forms-for-selected-title.ts";
import { getPbCategorySubTitles } from "../../../../controllers/pb/get-dropdown-data/sub-category-titles.ts";

export const handler: Handlers = {
    async POST(req, _ctx) {
        const body = await req.json();
        if (body.dropdown === 'category') {
          const { category } = body;
          // fetch form titles for this category
          const categoryTitles = await getPbCategoryTitles(category);
          return new Response(JSON.stringify(categoryTitles));
        }
        if (body.dropdown === 'title') {
          const { title, category } = body;
          // fetch forms for this title
          const formsForTitle = await getPbFormsForTitle(category, title);
          return new Response(JSON.stringify(formsForTitle));
        }
        if (body.dropdown === 'sub-title') {
          const { title, category } = body;
          // fetch forms for this title
          const formsForTitle = await getPbCategorySubTitles(category, title);
          return new Response(JSON.stringify(formsForTitle));
        }
        return new Response(null);
    }
}