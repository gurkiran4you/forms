/** @jsxImportSource https://esm.sh/preact */

import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <Component />
      <footer class="h-12 bg-slate-700 w-full">
        <div class="flex justify-between px-5 items-center h-full">
          <div class="w-1/4"></div>
          <div class="w-1/2">
            <ul class="list-none flex justify-center">
              <li class="text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize mr-5">about us</li>
              <li class="text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize mr-5">why this?</li>
              <li class="text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize">feedback</li>
            </ul>
          </div>
          <div class="text-slate-200 text-xs w-1/4 text-end">&copy; {currentYear} G Singh</div>
        </div>
      </footer>
    </>
  );
}