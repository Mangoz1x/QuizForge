# Anthropic API (Claude) — JS SDK Reference

## Installation

```bash
npm install @anthropic-ai/sdk
```

## Client Setup

```js
import Anthropic from "@anthropic-ai/sdk";

// Reads ANTHROPIC_API_KEY from environment automatically
const client = new Anthropic();

// Or pass explicitly
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

## Models

| Model | ID |
|-------|----|
| Claude Opus 4.6 | `claude-opus-4-6` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` |

---

## Streaming

Two approaches are available for streaming responses.

### Approach 1: `client.messages.stream()` (Recommended)

Returns a `MessageStream` object with helper methods and event handlers.

```js
const stream = client.messages.stream({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude!" }],
});

stream.on("text", (textDelta) => {
  process.stdout.write(textDelta);
});

const message = await stream.finalMessage();
```

#### MessageStream Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `text` | `(textDelta, textSnapshot) => void` | Each text chunk; snapshot is full text so far |
| `inputJson` | `(partialJson, jsonSnapshot) => void` | Tool input JSON deltas |
| `message` | `(message) => void` | Fires when streaming completes |
| `contentBlock` | `(block) => void` | Fires when a content block completes |
| `error` | `(error) => void` | Stream errors |
| `end` | `() => void` | Final event when stream is fully done |

#### MessageStream Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `finalMessage()` | `Promise<Message>` | The complete final Message |
| `finalText()` | `Promise<string>` | The text content of the final message |
| `done()` | `Promise<void>` | Resolves when stream completes |
| `abort()` | `void` | Cancels the stream |

### Approach 2: `client.messages.create({ stream: true })`

Returns a raw async iterable of SSE events. Lower-level, does not accumulate a final message.

```js
const stream = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude!" }],
  stream: true,
});

for await (const event of stream) {
  if (
    event.type === "content_block_delta" &&
    event.delta.type === "text_delta"
  ) {
    process.stdout.write(event.delta.text);
  }
}
```

#### SSE Event Flow

1. `message_start` — initial Message object with empty content
2. `content_block_start` — beginning of a content block (text, tool_use, thinking)
3. `content_block_delta` (repeated) — incremental updates:
   - `text_delta` — `{ type: "text_delta", text: "..." }`
   - `input_json_delta` — `{ type: "input_json_delta", partial_json: "..." }`
   - `thinking_delta` — `{ type: "thinking_delta", thinking: "..." }`
4. `content_block_stop` — end of a content block
5. `message_delta` — top-level updates (e.g. `stop_reason`, cumulative `usage`)
6. `message_stop` — final event

### Complete Streaming Example

```js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function streamExample() {
  const stream = client.messages.stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    system: "You are a helpful assistant.",
    messages: [
      { role: "user", content: "Write a short poem about the ocean." },
    ],
  });

  stream.on("text", (textDelta) => {
    process.stdout.write(textDelta);
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
  });

  const finalMessage = await stream.finalMessage();
  console.log("\nStop reason:", finalMessage.stop_reason);
  console.log("Usage:", finalMessage.usage);
}

streamExample();
```

---

## Structured Outputs

Three approaches for getting structured JSON from Claude.

### Approach A: `output_config.format` with JSON Schema (Recommended)

Uses constrained decoding to guarantee the output matches your schema. Generally available, no beta headers needed.

```js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content:
        "Extract info: John Smith (john@example.com), wants Enterprise plan, demo next Tuesday.",
    },
  ],
  output_config: {
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          plan_interest: { type: "string" },
          demo_requested: { type: "boolean" },
        },
        required: ["name", "email", "plan_interest", "demo_requested"],
        additionalProperties: false,
      },
    },
  },
});

const data = JSON.parse(response.content[0].text);
// { name: "John Smith", email: "john@example.com", plan_interest: "Enterprise", demo_requested: true }
```

#### Streaming with Structured Outputs

```js
const stream = client.messages.stream({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Summarize the benefits of exercise." }],
  output_config: {
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          topics: { type: "array", items: { type: "string" } },
        },
        required: ["summary", "topics"],
        additionalProperties: false,
      },
    },
  },
});

stream.on("text", (delta) => {
  process.stdout.write(delta); // JSON text arrives in chunks
});

const finalMsg = await stream.finalMessage();
const result = JSON.parse(finalMsg.content[0].text);
```

### Approach B: Strict Tool Use (`strict: true`)

Guarantees tool input parameters conform to your schema via constrained decoding.

```js
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "What's the weather in San Francisco?" },
  ],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          location: { type: "string" },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
        additionalProperties: false,
      },
    },
  ],
});

const toolBlock = response.content.find((b) => b.type === "tool_use");
console.log(toolBlock.input); // { location: "San Francisco, CA" }
```

### Approach C: Tool Use for Data Extraction (Classic Pattern)

Define a tool and force Claude to call it. The tool's `input` becomes your structured data.

```js
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  system: "You are an entity extraction system. Use the provided tool to extract information.",
  messages: [
    {
      role: "user",
      content: "John Smith is 35 years old and works at Acme Corp as a senior engineer.",
    },
  ],
  tools: [
    {
      name: "extract_person",
      description: "Extract structured information about a person.",
      input_schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "integer" },
          company: { type: "string" },
          job_title: { type: "string" },
        },
        required: ["name", "age", "company", "job_title"],
      },
    },
  ],
  tool_choice: { type: "tool", name: "extract_person" },
});

const toolBlock = response.content.find((b) => b.type === "tool_use");
console.log(toolBlock.input);
// { name: "John Smith", age: 35, company: "Acme Corp", job_title: "senior engineer" }
```

---

## JSON Schema Limitations

**Supported:** `object`, `array`, `string`, `integer`, `number`, `boolean`, `null`, `enum`, `const`, `anyOf`, `allOf`, `$ref`/`$def`, `required`, `default`, string formats (`date-time`, `date`, `email`, `uri`, `uuid`, etc.), `minItems` (0 or 1 only), basic `pattern`.

**Not supported:** Recursive schemas, numerical constraints (`minimum`, `maximum`), string constraints (`minLength`, `maxLength`), array constraints beyond `minItems` 0/1, `additionalProperties` set to anything other than `false`, regex lookahead/lookbehind.

---

## Common Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | Yes | Model ID |
| `max_tokens` | `number` | Yes | Maximum output tokens |
| `messages` | `array` | Yes | `[{ role, content }]` |
| `system` | `string` | No | System prompt |
| `temperature` | `number` | No | 0.0–1.0 (default 1.0) |
| `top_p` | `number` | No | Nucleus sampling |
| `stop_sequences` | `string[]` | No | Custom stop sequences |
| `stream` | `boolean` | No | Enable streaming (`.create()` only) |
| `tools` | `array` | No | Tool definitions |
| `tool_choice` | `object` | No | `{ type: "auto" \| "any" \| "tool" \| "none" }` |
| `output_config` | `object` | No | Structured output format |

---

## Caveats

- **First-request latency**: A new schema has extra latency the first time (grammar compilation). Cached for 24 hours after.
- **Refusals**: If Claude refuses for safety reasons, `stop_reason` will be `"refusal"` and output may not match the schema.
- **Token limits**: If `stop_reason` is `"max_tokens"`, output may be incomplete JSON. Retry with higher `max_tokens`.
- **Incompatibilities**: `output_config.format` is incompatible with Citations and Message Prefilling.
