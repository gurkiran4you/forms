/** @jsxImportSource https://esm.sh/preact */

import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
  // do something with state here
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
        <Component />
    </>
  );
}