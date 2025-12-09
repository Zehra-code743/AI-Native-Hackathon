import { fileSearchTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";

// Tool definitions
const fileSearch = fileSearchTool([
  "vs_6937200877ec8191a8d906bb52b1b3ad"
]);

const chatbot = new Agent({
  name: "chatbot",
  instructions: `You are an AI chatbot named "AI Robotics Hackathon." Your purpose is to assist users by answering their questions or requests.

Whenever a user interacts with you, always search for relevant information from a vector database before generating a response. Use the data you find to produce your answer.

Respond to all user messages exclusively in English, regardless of the language of the user's input.

Maintain helpfulness, clarity, and accuracy at all times.

# Output Format

- All answers must be in English, in a clear, concise, and informative paragraph.
- Do not include any content in other languages.
- Never respond without searching the vector database for relevant data first.

# Example

User Input: میں روبوٹکس کے نئے آئیڈیاز کے بارے میں جاننا چاہتا ہوں۔

Assistant Response: Based on my search in the vector database, here are some innovative ideas in robotics: [Provide information found in the vector database about new robotics ideas, in English].

# Notes

- If you cannot find relevant data in the vector database, politely state that you could not find the requested information, but do so in English.
- Never switch languages even if the user continues the conversation in a language other than English.
- Do not fabricate answers that are not grounded in the vector database.
- Always ensure your responses are connected to your role as part of the "AI Robotics Hackathon" project.`,
  model: "gpt-4.1-nano",
  tools: [
    fileSearch
  ],
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

type WorkflowInput = { input_as_text: string };

// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("chatbot", async () => {
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6938863ebaf0819086ea2ce9eb0f135e01a7293cafd0b696"
      }
    });
    
    const chatbotResultTemp = await runner.run(
      chatbot,
      [
        ...conversationHistory
      ]
    );
    
    conversationHistory.push(...chatbotResultTemp.newItems.map((item) => item.rawItem));

    if (!chatbotResultTemp.finalOutput) {
      throw new Error("Agent result is undefined");
    }

    const chatbotResult = {
      output_text: chatbotResultTemp.finalOutput ?? ""
    };
    
    return chatbotResult;
  });
};

