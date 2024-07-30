/** @jsxImportSource https://esm.sh/preact */

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPbFormTypes } from "../../controllers/pb/get-form-types/types.ts";
import { DropdownSelectionPb } from "../../islands/pb/dropdown-selection-pb.tsx";
import { DropdownOption } from "../../models/common.ts";

interface Data {
    formTypes: DropdownOption[],
}

export const handler: Handlers<Data> = {
    async GET(_req, ctx) {
      const allPbFormTypes = await getPbFormTypes();
      if (allPbFormTypes == null) {
        return ctx.render({ formTypes: [] });
      }
      ctx.state.formTypes = allPbFormTypes;
      return ctx.render({ formTypes: allPbFormTypes });
    },
  };
  
export default function Home(props: PageProps<Data>) {
    const { formTypes } = props.data;

  return (
      <>
        <section class="bg-amber-100 flex flex-auto py-2">
          <DropdownSelectionPb width="w-1/5" name="pb_category" options={formTypes} selectedOption={''} nextRoute="category"/>
        </section>
        <section class="flex flex-col px-8 relative min-h-screen min-h-lvh">
          <div class="bg-wheat bg-no-repeat absolute opacity-10 -z-10 w-auto h-auto top-0 bottom-0 left-0 right-0 bg-cover"></div>
        </section>
      </>
  );
}
