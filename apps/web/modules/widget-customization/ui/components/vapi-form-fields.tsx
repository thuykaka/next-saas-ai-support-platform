import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@workspace/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import {
  useVapiAssistants,
  useVapiPhoneNumbers
} from '@/modules/plugins/hooks/use-vapi-data';
import { type WidgetCustomizationFormSchema } from '@/modules/widget-customization/ui/types';

interface VapiFormFieldsProps {
  form: UseFormReturn<WidgetCustomizationFormSchema>;
}

export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
  const { data: assistants, loading: assistantsLoading } = useVapiAssistants();
  const { data: phoneNumbers, loading: phoneNumbersLoading } =
    useVapiPhoneNumbers();

  const disabled = form.formState.isSubmitting;

  return (
    <>
      <FormField
        control={form.control}
        name='vapiSettings.assistantId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={assistantsLoading || disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? 'Loading voice assistants...'
                        : 'Select a voice assistant'
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='none'>None</SelectItem>
                {assistants?.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || 'N/A'} -{' '}
                    {assistant.model?.model || 'N/A'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className='text-muted-foreground text-xs'>
              Select the voice assistant to use for the chat widget.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='vapiSettings.phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={phoneNumbersLoading || disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      phoneNumbersLoading
                        ? 'Loading phone numbers...'
                        : 'Select a phone number'
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='none'>None</SelectItem>
                {phoneNumbers?.map((phoneNumber) => (
                  <SelectItem
                    key={phoneNumber.id}
                    value={phoneNumber.number || phoneNumber.id}
                  >
                    {phoneNumber.name || 'N/A'} ({phoneNumber.number || 'N/A'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className='text-muted-foreground text-xs'>
              Select the phone number to use for the chat widget.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
