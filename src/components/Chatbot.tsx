import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { generateRAGResponse } from "@/utils/ragUtils";
import { Send } from "lucide-react";
import { stats } from "./dashboard/PowerStats";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const getDashboardValue = (query: string): string => {
  const lowercaseQuery = query.toLowerCase();
  
  // Find matching stat based on query
  const matchingStat = stats.find(stat => {
    const title = stat.title.toLowerCase();
    return lowercaseQuery.includes(title);
  });

  if (matchingStat) {
    return `${matchingStat.title}: ${matchingStat.value}${matchingStat.unit ? ' ' + matchingStat.unit : ''} (${matchingStat.description})`;
  }

  return "I couldn't find this information in the dashboard.";
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      // First check if we can get the value from dashboard
      const dashboardValue = getDashboardValue(input);
      if (dashboardValue !== "I couldn't find this information in the dashboard.") {
        return dashboardValue;
      }
      // If not found in dashboard, use RAG
      return generateRAGResponse(input);
    },
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(input);
    setInput("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}