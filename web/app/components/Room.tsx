import OtherCursors from "~/presence/other-cursors";
import useCursorTracking from "~/presence/use-cursors";

export default function Room() {
  useCursorTracking("document");
  return <OtherCursors />;
}
