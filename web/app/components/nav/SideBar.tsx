import WoodenLine from "~/assets/img/wooden-line.svg";
import { SideBarType } from "~/types/general";
import { AppConfig } from "~/config/config";

export default function SideBar({ type }: { type: SideBarType }) {
  return (
    <div
      className="hidden md:flex sticky z-10 top-10 pr-2 2xl:pr-10 flex-col justify-start pl-10 2xl:pl-0"
      style={{
        alignSelf: "flex-start",
      }}
    >
      <div className="flex flex-row justify-center items-center w-full">
        <h1
          className="text-3xl font-black"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
            inlineSize: "fit-content",
          }}
        >
          {AppConfig.sideBarItemsByType[type].title}
        </h1>
        <img src={WoodenLine} alt="Wooden Line" className="-ml-4 h-50" />
      </div>
      {/* <Form method="get">
        <div
          className="flex flex-row justify-center items-center mt-10 tooltip"
          data-tip="Fetch more"
        >
          <button className="btn btn-circle bg-black" type="submit">
            <IconReload size={24} color="white" stroke={2} />
          </button>
        </div>
      </Form> */}
    </div>
  );
}
