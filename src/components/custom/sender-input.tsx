import { ArrowUp } from "lucide-react";
import { ChatFormType } from "@/types/";
import { Textarea } from "@/src/components//ui/textarea";
import { Button } from "@/src/components//ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/src/components/ui/form";
import { FormEvent, useState } from "react";

interface SenderInputProps {
  form?: ChatFormType;
  onSubmit?: (values: ChatFormType, ...args: any[]) => Promise<void>;
  // Fonction de soumission du formulaire
  onSendMessage: (message: string) => void
  className?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>; // Ajout des props supplémentaires pour le
  inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>; // Ajout des props supplémentaires pour le Textarea
}

const ChatInputField = ({
  form,
  onSubmit,
  onSendMessage,
  className,
  buttonProps,
  inputProps,
}: SenderInputProps) => {

  const handleSubmit = (e: FormEvent) => {
    const [input, setInput] = useState<string>("")
      e.preventDefault()
      if (input.trim() === "") return
  
      onSendMessage(input)
      setInput("")
    }
  return (
    <div className={className}>
      {form && onSubmit ? (
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[900px] w-full bg-zinc-900 rounded-3xl  flex items-center"
          >
            <div className="w-full bg-zinc-900 rounded-3xl p-2">
              <FormField
                control={form.control}
                name={form.control.name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="w-full bg-zinc-900 resize-none text-white placeholder:text-gray-400 rounded-3xl"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button {...buttonProps} size={"icon"} className="cursor-pointer">
                <ArrowUp />
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="max-w-[900px] w-full bg-zinc-800 rounded-3xl flex items-center">
          <form onSubmit={handleSubmit} className="w-full bg-zinc-700 rounded-3xl p-2">
            <Textarea
              className="w-full bg-transparent resize-none text-white placeholder:text-gray-400 rounded-3xl min-h-10 max-h-40 overflow-y-auto"
              placeholder="Posez votre question ici..."
              {...inputProps}
            />
            <div className="flex justify-end mt-2">
              <Button {...buttonProps} size={"icon"} className="cursor-pointer">
                <ArrowUp />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInputField;
