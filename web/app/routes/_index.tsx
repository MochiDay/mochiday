import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "MochiDay" },
    {
      name: "description",
      content: "Reclaim your life.",
    },
  ];
};

export default function Index() {
  return <div>Welcome to MochiDay</div>;
}
