/** @jsxImportSource https://esm.sh/preact */

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPbCategoryTitles } from "../../../../../controllers/pb/get-dropdown-data/category-titles.ts";
import { getPbFormsForTitle } from "../../../../../controllers/pb/get-dropdown-data/forms-for-selected-title.ts";
import { getPbCategorySubTitles } from "../../../../../controllers/pb/get-dropdown-data/sub-category-titles.ts";
import { getPbFormTypes } from "../../../../../controllers/pb/get-form-types/types.ts";
import { OfflineFormDialogPb } from "../../../../../islands/pb/dialogs/dialog-pb-offline.tsx";
import { PreviewDialogPb } from "../../../../../islands/pb/dialogs/dialog-pb-preview.tsx";
import { DropdownSelectionPb } from "../../../../../islands/pb/dropdown-selection-pb.tsx";
import { PunjabForm } from "../../../../../islands/pb/form-pb.tsx";
import { DropdownOption, Form_m, NestedGroup_m } from "../../../../../models/common.ts";

interface Data {
    categories: DropdownOption[],
    selectedCategory: string,
    selectedCategoryTitle: string,
    titles: DropdownOption[],
    selectedTitle: string,
    subTitles: DropdownOption[],
    forms?: Form_m[],
    nestedGroups?: NestedGroup_m[],
}


export const handler: Handlers<Data> = {
    async GET(_req, ctx) {
        const { slug, t } = ctx.params;
        let subTitles: DropdownOption[] = [];
        const selectedCategoryId = decodeURI(slug);
        const selectedTitleOptionId = decodeURI(t);
        const allPbFormTypes = await getPbFormTypes() ?? [];
        const categoryType = allPbFormTypes.find(type => type.id === selectedCategoryId);
        if (categoryType == null) {
          return ctx.render(); // 404
        }
        const categoryTitles = await getPbCategoryTitles(categoryType.title) ?? [];

        let allForms: { formsRes: Form_m[] , nestedGroupsRes: NestedGroup_m[]};
        let forms: Form_m[] = [];
        let nestedGroups: NestedGroup_m[] = [];
        if (categoryType.title === 'pseb') {
            subTitles = await getPbCategorySubTitles('pseb', selectedTitleOptionId) ?? [];
        } else {
            // fetch forms 
            allForms = await getPbFormsForTitle(categoryType.title, selectedTitleOptionId) as  { formsRes: Form_m[] , nestedGroupsRes: NestedGroup_m[]};
            forms = allForms.formsRes;
            nestedGroups = allForms.nestedGroupsRes;
        }
        return ctx.render({ 
            categories: allPbFormTypes, 
            selectedCategory: selectedCategoryId,
            selectedCategoryTitle: categoryType.title,
            selectedTitle: selectedTitleOptionId,
            titles: categoryTitles ,
            subTitles,
            forms,
            nestedGroups,
        });
      },
  };
  
export default function Home(props: PageProps<Data>) {
    const { titles = [], 
            selectedCategory = '', 
            categories = [], 
            selectedTitle = '', 
            subTitles = [] ,
            forms = [],
            selectedCategoryTitle = '',
            nestedGroups = []} = props.data;
    
    const category = categories.find(c => c.id === selectedCategory);
    const needsSubTitles = category?.title === 'pseb';

    const offlineFormId = 'offline-form-modal-pb-simple';
    const previewFormId = 'preview-form-modal-pb-simple';

  return (
      <>
        <section class="bg-amber-100 flex flex-auto py-2">
            <DropdownSelectionPb width="w-1/5" name="pb_category" options={categories} selectedOption={selectedCategory} nextRoute="category"/>
            <DropdownSelectionPb width="w-5/12" name="pb_title" options={titles} selectedOption={selectedTitle} nextRoute="title"/>
            {
                needsSubTitles && <DropdownSelectionPb width="w-5/12" name="pb_title" options={subTitles} selectedOption={''} nextRoute="subtitle"/>
            }
        </section>
        <section class="flex flex-col px-8 relative min-h-screen min-h-lvh">
        <div class="bg-wheat bg-no-repeat absolute opacity-10 -z-10
                    w-auto h-auto top-0 bottom-0 left-0 right-0 bg-cover"></div>
        {
            forms.map(f => <PunjabForm categoryTitle={selectedCategoryTitle} previewDialogID={previewFormId} form={f} category={selectedCategory} dialogID={offlineFormId} />)
        }
        {
            nestedGroups.map((group) => {
                return (
                    <div key={group.id} class="">
                        <div class="">{group.subCategory}</div>
                        {
                            group.nestedForms?.map(f => {
                                return(
                                    <PunjabForm 
                                    nested={true} 
                                    form={f} 
                                    category={selectedCategory}
                                    previewDialogID={previewFormId} 
                                    dialogID={offlineFormId} />
                                )
                            })
                        }
                    </div>
                )
            })
        }
        </section>

       <OfflineFormDialogPb id={offlineFormId} />
       <PreviewDialogPb id={previewFormId} />
      </>
  );
}
