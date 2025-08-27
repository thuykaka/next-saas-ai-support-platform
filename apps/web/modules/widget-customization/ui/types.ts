import { z } from 'zod';
import { widgetCustomizationFormSchema } from '@/modules/widget-customization/ui/schemas';

export type WidgetCustomizationFormSchema = z.infer<
  typeof widgetCustomizationFormSchema
>;
