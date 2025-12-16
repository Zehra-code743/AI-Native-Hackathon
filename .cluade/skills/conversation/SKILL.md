name: "conversation-agent"
description: "Enable humanoid robots to understand speech and provide responses using Whisper + GPT models."
version: "1.0.0"
---
# Conversation Agent

## When to Use This Skill
- User gives voice instructions
- Robot must explain its actions
- Multi-modal interaction (speech + vision)

## How This Skill Works
1. Capture voice via microphone
2. Convert speech to text (Whisper)
3. Process with GPT for understanding/response
4. Send commands to planning/control agents

## Output Format
- Parsed command
- Generated response text
- Optional speech output

## Example
*Input*: “Robot, bring me the red book”  
*Output*: Command parsed, response: “Okay, I will pick up the red book”
