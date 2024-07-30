/** @jsxImportSource https://esm.sh/preact */

import { Link } from "../components/Link.tsx";

interface Data {}

export function handler(req: Request): Response {
  //: Todo remove this if a peroper landing page is built
  const {protocol, host, hostname, port} = new URL(req.url);

  console.log(protocol, host, hostname, port);

  const headers = new Headers({
    location: `/punjab`,
  });
  return new Response(null, {
    status: 302,
    headers,
  });
};


export default function Home() {
  return (
    <>
      <div class="px-4 py-8 mx-auto">
        <section class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold uppercase border-b-4 border-black border-solid">Welcome</h1>
        </section>

        <section class="flex flex-auto mt-8 pb-8 border-b-4 border-black border-solid">
          Some login message or just a message <br />
          Google captcha to prove you are a human
        </section>

        <section>
          Redirection button here 
          <Link href={"/punjab"}>Start</Link>
        </section>
      </div>
    </>
  );
}
