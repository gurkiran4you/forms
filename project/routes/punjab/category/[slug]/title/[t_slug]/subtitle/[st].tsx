/** @jsxImportSource https://esm.sh/preact */

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPbCategoryTitles } from "../../../../../../../controllers/pb/get-dropdown-data/category-titles.ts";
import { getPbFormsForSubTitle } from "../../../../../../../controllers/pb/get-dropdown-data/forms-for-selected-subtitle.ts";
import { getPbCategorySubTitles } from "../../../../../../../controllers/pb/get-dropdown-data/sub-category-titles.ts";
import { getPbFormTypes } from "../../../../../../../controllers/pb/get-form-types/types.ts";
import { FormTypes } from "../../../../../../../fetchData/pb/categories.ts";
import { OfflineFormDialogPb } from "../../../../../../../islands/pb/dialogs/dialog-pb-offline.tsx";
import { PreviewDialogPb } from "../../../../../../../islands/pb/dialogs/dialog-pb-preview.tsx";
import { DropdownSelectionPb } from "../../../../../../../islands/pb/dropdown-selection-pb.tsx";
import { PunjabForm } from "../../../../../../../islands/pb/form-pb.tsx";
import { DropdownOption, Form_m } from "../../../../../../../models/common.ts";

interface Data {
    categories: DropdownOption[],
    selectedCategory: string,
    titles: DropdownOption[],
    selectedTitle: string,
    subTitles: DropdownOption[],
    selectedSubTitle: string,
    forms: Form_m[],
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const { slug, t_slug, st } = ctx.params;
    const selectedCategoryId = decodeURI(slug);
    const selectedTitleOptionId = decodeURI(t_slug);
    const selectedSubTitleOptionId = decodeURI(st);
    const allPbFormTypes = await getPbFormTypes() ?? [];
    const categoryType = allPbFormTypes.find(type => type.id === selectedCategoryId);
    if (categoryType == null) {
      return ctx.render(); // 404
    }
    const categoryTitles = await getPbCategoryTitles(categoryType.title) ?? [];
    const subTitles = await getPbCategorySubTitles(categoryType.title, selectedTitleOptionId) ?? [];

    // fetch forms 
    const forms = await getPbFormsForSubTitle(categoryType.title, selectedSubTitleOptionId);
    if (forms == null) {
      return ctx.render(); // 404
    }
    return ctx.render({ 
        categories: allPbFormTypes, 
        selectedCategory: selectedCategoryId, 
        selectedTitle: selectedTitleOptionId,
        titles: categoryTitles,
        selectedSubTitle: selectedSubTitleOptionId,
        subTitles,
        forms,
    });
  },
};
  
export default function Home(props: PageProps<Data>) {
  const { titles = [], 
    selectedCategory = '', 
    categories = [], 
    selectedTitle = '', 
    subTitles = [] ,
    selectedSubTitle = '',
    forms = [] } = props.data;

    const offlineFormId = 'offline-form-modal-pb-complex';
    const previewFormId = 'preview-form-modal-pb-simple';

  return (
      <>
        <section class="bg-amber-100 flex flex-auto py-2">
          <DropdownSelectionPb width="w-1/5" name="pb_category" options={categories} selectedOption={selectedCategory} nextRoute="category"/>
          <DropdownSelectionPb width="w-5/12" name="pb_title" options={titles} selectedOption={selectedTitle} nextRoute="title"/>
          <DropdownSelectionPb width="w-5/12" name="pb_title" options={subTitles} selectedOption={selectedSubTitle} nextRoute="subtitle"/>
        </section>

        <section class="flex flex-col px-8 relative min-h-screen min-h-lvh">
        <div class="bg-wheat bg-no-repeat absolute opacity-10 -z-10
                    w-auto h-auto top-0 bottom-0 left-0 right-0 bg-cover"></div>
        {
            forms.map(f => <PunjabForm previewDialogID={previewFormId} form={f} category={selectedCategory} dialogID={offlineFormId} />)
        }
        </section>

       <OfflineFormDialogPb id={offlineFormId} />
       <PreviewDialogPb id={previewFormId} />
      </>
  );
}
