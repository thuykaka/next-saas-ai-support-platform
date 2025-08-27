import { z } from 'zod';

export const widgetCustomizationFormSchema = z.object({
  greetingMessage: z.string().min(1, {
    message: 'Greeting message is required'
  }),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional()
  }),
  vapiSettings: z.object({
    phoneNumber: z.string().optional(),
    assistantId: z.string().optional()
  })
});

