// import { z } from 'zod';
// import { ReactNode } from 'react';

// export default function SearchHookFormProvider({ children }: { children: ReactNode }) {
//   const methods = useForm<z.infer<typeof searchSchema>>({
//     resolver: zodResolver(searchSchema),
//     defaultValues: {
//       ...DEFAULT_VALUES,
//     },
//     mode: 'onSubmit'
//   });

//   return <FormProvider {...methods}> {children} </FormProvider>
// }
