/** @jsxImportSource https://esm.sh/preact */

import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
  // do something with state here
  return (
    <>
      <Component />
      <footer class="h-20 bg-slate-700 w-full">
        <div class="flex justify-between px-5 items-center h-full">
          <div class="">Something</div>
          <div>
            <ul class="list-none flex">
              <li class="text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize mr-5">about us</li>
              <li class="text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize mr-5">why this?</li>
              <li class="text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize">feedback</li>
            </ul>
          </div>
          <div class="">Something</div>
        </div>
      </footer>
    </>
  );
}