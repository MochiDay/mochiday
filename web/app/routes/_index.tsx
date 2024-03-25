import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export const loader = ({ context }: LoaderFunctionArgs) => {
  console.log(context.cloudflare.env.CLERK_PUBLISHABLE_KEY);
  return null;
};

export default function Index() {
  return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}
