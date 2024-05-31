import OtherCursors from "~/presence/other-cursors";
import useCursorTracking from "~/presence/use-cursors";

export function Room() {
  useCursorTracking("document");
  return <OtherCursors />;
}
