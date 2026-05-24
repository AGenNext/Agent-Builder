"use client";

import { Action, a2ui } from "../../../packages/a2ui-core/src";
import { A2UIRenderer } from "../../../packages/a2ui-react/src";

const surface = a2ui.surface({
  id: "reservation-flow",
  title: "Restaurant Reservation",
  components: [
    a2ui.heading("Book a Table"),
    a2ui.form({
      title: "Reservation Details",
      submit: Action.submit("reservation.create"),
      children: [
        a2ui.input("Name", "/reservation/name"),
        a2ui.input("Date", "/reservation/date"),
        a2ui.input("Guests", "/reservation/guests")
      ]
    })
  ]
});

const payload = a2ui.response({
  message: "This interface was generated from an A2UI payload.",
  surface
});

export default function Page() {
  return (
    <main style={{ padding: 32 }}>
      <h1>A2UI Next Demo</h1>
      <A2UIRenderer
        payload={payload}
        onAction={(action, state) => {
          console.log("A2UI action", action);
          console.log("A2UI state", state);
        }}
      />
    </main>
  );
}
