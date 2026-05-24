import type {
  A2UIAction,
  A2UIComponent,
  A2UIResponse,
  A2UISurface,
  ComponentType
} from "./schema";
import { validateSurface } from "./validate";

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function component(args: {
  id?: string;
  type: ComponentType;
  props?: Record<string, unknown>;
  bind?: string;
  action?: A2UIAction;
  children?: A2UIComponent[];
}): A2UIComponent {
  return {
    id: args.id ?? createId(args.type.toLowerCase()),
    type: args.type,
    props: args.props,
    bind: args.bind,
    action: args.action,
    children: args.children
  };
}

export const a2ui = {
  text(text: string): A2UIComponent {
    return component({
      type: "Text",
      props: { text }
    });
  },

  heading(text: string, level = 2): A2UIComponent {
    return component({
      type: "Heading",
      props: { text, level }
    });
  },

  input(label: string, bind: string): A2UIComponent {
    return component({
      type: "Input",
      bind,
      props: { label }
    });
  },

  button(label: string, action: A2UIAction): A2UIComponent {
    return component({
      type: "Button",
      action,
      props: { label }
    });
  },

  form(args: {
    title?: string;
    children: A2UIComponent[];
    submit: A2UIAction;
  }): A2UIComponent {
    return component({
      type: "Form",
      props: { title: args.title },
      children: [
        ...args.children,
        this.button("Submit", args.submit)
      ]
    });
  },

  surface(args: {
    id: string;
    title?: string;
    components: A2UIComponent[];
  }): A2UISurface {
    const surface: A2UISurface = {
      id: args.id,
      title: args.title,
      components: args.components
    };

    validateSurface(surface);
    return surface;
  },

  response(args: {
    message?: string;
    surface: A2UISurface;
  }): A2UIResponse {
    return {
      message: args.message,
      ui: {
        surface: args.surface
      }
    };
  }
};
