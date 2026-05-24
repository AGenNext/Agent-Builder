import { z } from "zod";

export const ComponentTypeSchema = z.enum([
  "Text",
  "Heading",
  "Button",
  "Input",
  "NumberInput",
  "Textarea",
  "Select",
  "Checkbox",
  "DatePicker",
  "Table",
  "Card",
  "Form",
  "Modal",
  "Tabs",
  "Badge",
  "Alert",
  "Timeline",
  "Chart",
  "Stepper"
]);

export type ComponentType = z.infer<typeof ComponentTypeSchema>;

export const ActionTypeSchema = z.enum([
  "submit",
  "navigate",
  "open_modal",
  "close_modal",
  "refresh",
  "approve",
  "reject",
  "retry",
  "search",
  "filter",
  "paginate"
]);

export type ActionType = z.infer<typeof ActionTypeSchema>;

export const A2UIActionSchema = z.object({
  type: ActionTypeSchema,
  target: z.string().optional(),
  payload: z.record(z.unknown()).default({})
});

export type A2UIAction = z.infer<typeof A2UIActionSchema>;

export type A2UIComponent = {
  id: string;
  type: ComponentType;
  props?: Record<string, unknown>;
  bind?: string;
  action?: A2UIAction;
  children?: A2UIComponent[];
};

export const A2UIComponentSchema: z.ZodType<A2UIComponent> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    type: ComponentTypeSchema,
    props: z.record(z.unknown()).optional(),
    bind: z.string().startsWith("/", "Binding paths must start with '/'.").optional(),
    action: A2UIActionSchema.optional(),
    children: z.array(A2UIComponentSchema).optional()
  })
);

export const A2UISurfaceSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  components: z.array(A2UIComponentSchema)
});

export type A2UISurface = z.infer<typeof A2UISurfaceSchema>;

export const A2UIResponseSchema = z.object({
  message: z.string().optional(),
  ui: z.object({ surface: A2UISurfaceSchema })
});

export type A2UIResponse = z.infer<typeof A2UIResponseSchema>;
