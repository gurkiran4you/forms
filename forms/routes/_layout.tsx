/** @jsxImportSource https://esm.sh/preact */

import { PageProps } from "$fresh/server.ts";
import { Footer } from "../islands/common/footer.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <Component />
      <footer class="h-12 bg-slate-700 w-full">
        <Footer textDialogID="generic-text-dialog" />
      </footer>
    </>
  );
}