/** @jsxImportSource https://esm.sh/preact */

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPbFormTypes } from "../../controllers/pb/types.ts";
import { DropdownSelectionPb } from "../../islands/dropdown-selections-pb.tsx";
import { FormTypes_m } from "../../models/common.ts";
import { getPbCategoryTitles } from "../../controllers/pb/categoryTitles.ts";
import { getPbFormsForTitle } from "../../controllers/pb/formsforSelectedTitle.ts";

interface Data {
    formTypes: FormTypes_m,
}

export const handler: Handlers<Data> = {
    async GET(_req, ctx) {
        // For now only forms exist, later these db calls
        // will be served after user selection
      const allPbFormTypes = await getPbFormTypes();
      if (allPbFormTypes == null) {
        return ctx.render({ formTypes: [] });
      }
      ctx.state.formTypes = allPbFormTypes;
      return ctx.render({ formTypes: allPbFormTypes });
    },
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
        return new Response(null);
    }
  };
  
export default function Home(props: PageProps<Data>) {
    const { formTypes } = props.data;
  return (
    <>
      <nav class="flex py-2 mx-auto justify-around">
        <section class="max-w-screen-md absolute left-12">
          <img class="w-16" src="/images/punjab.jpg" />
        </section>
        <section class="flex flex-col justify-center w-4/5 text-center">
          <h1 
            class="relative text-center text-amber-500 uppercase font-normal text-3xl 
            before:absolute before:content-[''] before:bottom-0  before:h-1 before:right-11 before:m-auto 
            after:absolute after:content-[''] after:left-0 after:bottom-0 after:w-11  after:h-1 after:right-11 after:m-auto after:bg-gray-300
            before:bg-amber-500 before:left-11 before:w-16">
              Punjab Forms Repository
            <span class="block leading-6 pb-3 italic font-serif text-xs text-stone-500">
            Find and download the latest forms for all provincial services
            </span>
          </h1>
        </section>
      </nav>
      <DropdownSelectionPb formTypes={formTypes} />
      </>
  );
}
