/** @jsxImportSource https://esm.sh/preact */

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPbFormTypes } from "../../../controllers/pb/get-form-types/types.ts";
import { DropdownSelectionPb } from "../../../islands/dropdown-selections-pb.tsx";
import { FormTypes_m } from "../../../models/common.ts";

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
  };
  
export default function Home(props: PageProps<Data>) {
    const { formTypes } = props.data;
  return (
      <>
        <DropdownSelectionPb formTypes={formTypes} />
      </>
  );
}
