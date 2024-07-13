/** @jsxImportSource https://esm.sh/preact */

import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Link(props: JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>) {
  const linkStyle = "px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors";
  if (props.href) {
    return (
      <a
        {...props as JSX.HTMLAttributes<HTMLAnchorElement>}
        class={linkStyle}
      />
    );
  }
  return (
    <button
      {...props as JSX.HTMLAttributes<HTMLButtonElement>}
      disabled={!IS_BROWSER || props.disabled}
      class={linkStyle}
    />
  );
}
