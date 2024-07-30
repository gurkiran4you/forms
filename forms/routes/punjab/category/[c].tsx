/** @jsxImportSource https://esm.sh/preact */

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPbCategoryTitles } from "../../../controllers/pb/get-dropdown-data/category-titles.ts";
import { getPbFormTypes } from "../../../controllers/pb/get-form-types/types.ts";
import { FormTypes } from "../../../../fetch-forms/fetchData/pb/categories.ts";
import { DropdownSelectionPb } from "../../../islands/pb/dropdown-selection-pb.tsx";
import { DropdownOption } from "../../../models/common.ts";

interface Data {
    titles: DropdownOption[],
    selectedCategory: FormTypes,
    categories: DropdownOption[],
}

export const handler: Handlers<Data> = {
    async GET(_req, ctx) {
        const selectedCategoryId = ctx.params.c;
        const selectedOption = decodeURI(selectedCategoryId) as FormTypes;
        const allPbFormTypes = await getPbFormTypes() ?? [];
        const categoryType = allPbFormTypes.find(type => type.id === selectedOption);
        if (categoryType == null) {
          return ctx.render(); // 404
        }
        const categoryTitles = await getPbCategoryTitles(categoryType.title) ?? [];
        return ctx.render({ categories: allPbFormTypes, selectedCategory: selectedOption as FormTypes, titles: categoryTitles });
      },
  };
  
export default function Home(props: PageProps<Data>) {
    const { titles = [], selectedCategory = '', categories = [] } = props.data;

  return (
      <>
        <section class="bg-amber-100 flex flex-auto py-2">
          <DropdownSelectionPb width="w-1/5" name="pb_category" options={categories} selectedOption={selectedCategory} nextRoute="category"/>
          <DropdownSelectionPb width="w-5/12" name="pb_title" options={titles} selectedOption={''} nextRoute="title"/>
        </section>
        <section class="flex flex-col px-8 relative min-h-screen min-h-lvh">
          <div class="bg-wheat bg-no-repeat absolute opacity-10 -z-10 w-auto h-auto top-0 bottom-0 left-0 right-0 bg-cover"></div>
        </section>
      </>
  );
}
