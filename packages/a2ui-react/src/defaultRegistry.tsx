import type { ComponentRegistry } from "./types";

export const defaultRegistry: ComponentRegistry = {
  Text: ({ props }) => {
    return <p>{String(props.text ?? "")}</p>;
  },

  Heading: ({ props }) => {
    return <h2>{String(props.text ?? "")}</h2>;
  },

  Input: ({ props, value, setValue }) => {
    return (
      <label>
        <span>{String(props.label ?? "")}</span>
        <input
          value={String(value ?? "")}
          onChange={(event) => setValue?.(event.target.value)}
        />
      </label>
    );
  },

  Button: ({ props, action, onAction }) => {
    return (
      <button
        type="button"
        onClick={() => {
          if (action) onAction?.(action, {});
        }}
      >
        {String(props.label ?? "Button")}
      </button>
    );
  },

  Form: ({ props, children }) => {
    return (
      <form>
        {props.title ? <h3>{String(props.title)}</h3> : null}
        {children}
      </form>
    );
  }
};
