import { Link } from "@remix-run/react";
import { IconBrandGithubFilled } from "@tabler/icons-react";

export function PartyModeExplainerModal({ modelId }: { modelId: string }) {
  return (
    <dialog id={modelId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">🎉 Party Mode (beta)</h3>
        <p className="py-4">
          Applying to jobs sucks. Party Mode makes it a little more fun!
        </p>
        <ul>
          <li>🌎 See other users' cursors in real time.</li>
          <li>👾 [WIP] Send a message to everyone.</li>
          <li>💅 [WIP] Change your cursor styles.</li>
        </ul>

        <div className="modal-action">
          <button className="btn  bg-black text-white">
            <Link
              to="https://github.com/MochiDay/mochiday"
              target="_blank"
              className="flex flex-row justify-center items-center"
            >
              <IconBrandGithubFilled className="h-15 w-15" />
              <div>Contribute</div>
            </Link>
          </button>

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
