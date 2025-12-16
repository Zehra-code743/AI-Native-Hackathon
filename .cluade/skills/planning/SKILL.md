name: "planning-agent"
description: "Translate high-level natural language commands into robot actions using VLA and GPT reasoning."
version: "1.0.0"
---
# Planning / VLA Agent

## When to Use This Skill
- Robot receives instructions like “Clean the table”
- Convert text to actionable sequences
- Plan object manipulation and navigation steps

## How This Skill Works
1. Receive natural language command
2. Use GPT or LLM to generate action plan
3. Send plan to control agent
4. Monitor execution and adapt if needed

## Output Format
- Ordered list of actions: {move, pick, place, navigate}
- Parameters for execution

## Example
*Input*: “Pick up the red cup and place it on the table”  
*Output*: [Navigate to cup], [Pick cup], [Navigate to table], [Place cup]
