# Grok API: Comprehensive Guide

This guide provides a detailed overview of the Grok API, covering its models, core features, best practices, and advanced usage patterns. It synthesizes information on prompt engineering, agentic tools (Search, Code Execution), structured outputs, streaming, reasoning, function calling, and stateful interactions.

## Table of Contents
1.  [Models Overview](#1-models-overview)
2.  [Core Principles: Prompt Engineering](#2-core-principles-prompt-engineering)
3.  [Key Feature: Agentic Tool Calling (Server-Side)](#3-key-feature-agentic-tool-calling-server-side)
    -   [Search Tools (Web & X)](#search-tools-web--x)
    -   [Code Execution Tool](#code-execution-tool)
    -   [Advanced Usage: Multiple Tools & Image Integration](#advanced-usage-multiple-tools--image-integration)
4.  [Key Feature: Function Calling (Client-Side)](#4-key-feature-function-calling-client-side)
5.  [Key Feature: Structured Outputs](#5-key-feature-structured-outputs)
6.  [Key Feature: Streaming Responses](#6-key-feature-streaming-responses)
7.  [Core Concept: Reasoning](#7-core-concept-reasoning)
8.  [API Interaction Model: Stateful Responses API](#8-api-interaction-model-stateful-responses-api)
9.  [General Best Practices & Considerations](#9-general-best-practices--considerations)

---

## 1. Models Overview

The Grok API offers several models tailored for different tasks:

-   **`grok-code-fast-1`**: A lightweight, highly efficient agentic model designed for pair-programming and day-to-day coding tasks. It excels at rapid iteration and is significantly faster and more cost-effective than other agentic models.
-   **`grok-4-fast`**: An agentic model trained to excel at using tools, particularly for search and code execution. It's the ideal choice for navigating large codebases or the web to find precise answers.
-   **`grok-4`**: A powerful model suited for one-shot Q&A, deep conceptual understanding, and tough debugging when all necessary context is provided upfront. It features a "Think Before Responding" capability.
-   **`grok-2-1212` / `grok-2-vision-1212` and later**: These models and their successors support the Structured Outputs feature.

## 2. Core Principles: Prompt Engineering

Effective prompting is crucial for getting the best results, especially from `grok-code-fast-1`.

### a. Provide Necessary Context
-   **Bad Prompt**: `Make error handling better`
-   **Good Prompt**: `My error codes are defined in @errors.ts, can you use that as reference to add proper error handling and error codes to @sql.ts where I am making queries`
> **Best Practice**: Be specific. Select the exact code, file paths, project structures, or dependencies you want the model to use as context. This focuses the model and prevents irrelevant output.

### b. Set Explicit Goals and Requirements
-   **Bad Prompt**: `Create a food tracker`
-   **Good Prompt**: `Create a food tracker which shows the breakdown of calorie consumption per day divided by different nutrients when I enter a food item. Make it such that I can see an overview as well as get high level trends.`
> **Best Practice**: Clearly define your goals and the specific problem to be solved. Detailed, concrete queries lead to better performance.

### c. Continually Refine Your Prompts
`grok-code-fast-1` is designed for rapid and affordable iteration. If the initial output isn't perfect, refine your query by adding more context or referencing the specific failures from the first attempt.
-   **Example Refinement**: `The previous approach didn't consider the IO heavy process which can block the main thread, we might want to run it in its own threadloop such that it does not block the event loop instead of just using the async lib version`

## 3. Key Feature: Agentic Tool Calling (Server-Side)

Agentic tool calling allows the model to use powerful, server-side tools to perform complex tasks like searching the web, analyzing data, and executing code. This is a core strength of `grok-4-fast`. *Requires `xai-sdk` version 1.3.0 or later.*

### Search Tools (Web & X)

The model can iteratively call search tools, analyze responses, and make follow-up queries to find information.

-   **Web Search (`web_search`)**: Allows the agent to search the web and browse pages.
-   **X Search (`x_search`)**: Allows the agent to perform keyword, semantic, and user searches on X.

#### Retrieving Citations
Citations provide traceability for sources used during a search. They are accessible from the response object (`response.citations`). Note that the array contains all sources the agent encountered, not all of which may be relevant to the final answer.

#### Search Filters
You can narrow the search space using optional parameters for each tool.

| Tool        | Supported Filter Parameters                                                                            |
|-------------|--------------------------------------------------------------------------------------------------------|
| **Web Search**  | `allowed_domains`, `excluded_domains`, `enable_image_understanding`                                    |
| **X Search**    | `allowed_x_handles`, `excluded_x_handles`, `from_date`, `to_date`, `enable_image_understanding`, `enable_video_understanding` |

-   **Domain/Handle Filtering**: Limit searches to a maximum of 5 allowed/excluded domains or 10 X handles. `allowed` and `excluded` parameters cannot be used together in the same request.
-   **Date Range**: Restrict X searches to a specific date range using `from_date` and `to_date` (ISO8601 format or `datetime` objects in Python SDK).
-   **Image/Video Understanding**: Setting `enable_image_understanding=True` or `enable_video_understanding=True` equips the agent with tools (`view_image`, `view_x_video`) to analyze visual content, increasing token usage.

### Code Execution Tool

The `code_execution` tool (named `code_interpreter` in the OpenAI compatible API) enables Grok to write and execute Python code in a secure, sandboxed environment.

#### Key Capabilities
-   **Mathematical Computations**: Solve complex equations, perform statistical analysis.
-   **Data Analysis**: Process datasets and extract insights from prompts.
-   **Financial Modeling**: Build models, calculate risk metrics.
-   **Code Generation & Testing**: Write, test, and debug Python snippets in real-time.

#### Best Practices for Code Execution
1.  **Be Specific**: Instead of "Analyze this data," ask "Calculate the correlation matrix for these variables and highlight correlations above 0.7".
2.  **Provide Context**: Specify data formats and constraints. E.g., "Here's my CSV data with columns: date, revenue, costs..."
3.  **Use Appropriate Model Settings**: Use a low `temperature` (0.0-0.3) for mathematical precision and use reasoning models like `grok-4-fast`.

#### Limitations
-   **Environment**: Code runs in a sandboxed Python environment with common libraries (NumPy, Pandas, Matplotlib, SciPy) pre-installed.
-   **No Network/File Access**: The environment has no access to external networks or file systems for security.
-   **Stateless**: The execution context does not persist between requests.

### Advanced Usage: Multiple Tools & Image Integration

#### Requests with Multiple Active Tools
You can activate multiple tools simultaneously by including them in the `tools` array of your request. The model will intelligently orchestrate between them based on the task.

**Example Tool Combinations:**
```python
# For research and data analysis
research_setup = [web_search(), code_execution()]

# For aggregating news and social media
news_setup = [web_search(), x_search()]

# For comprehensive analysis
comprehensive_setup = [web_search(), x_search(), code_execution()]
```

#### Image Integration
Include images in your tool-enabled conversations for visual analysis and context-aware searches.

```python
from xai_sdk.chat import image, user

chat.append(
    user(
        "Search the internet and tell me what kind of dog is in the image below.",
        image("https://.../image.jpg")
    )
)
```

## 4. Key Feature: Function Calling (Client-Side)

Function calling allows you to connect the model to your own external tools and APIs. It follows a Remote Procedure Call (RPC) pattern.

#### The Flow
1.  **Initial Request**: You send a user prompt along with a list of `tool_definitions` (functions the model can call, defined with Pydantic or as a raw JSON schema).
2.  **Model Response**: If the model decides to use a tool, it responds with a `tool_calls` object containing the function name and arguments it wants to execute.
3.  **Execute & Respond**: Your code parses the `tool_calls` object, executes the corresponding local function with the provided arguments, and sends the result back to the model in a new request with `role: "tool"`.
4.  **Final Answer**: The model uses the function's output to formulate and deliver the final user-facing answer.

#### Function Calling Modes (`tool_choice`)
-   `"auto"` (Default): The model decides whether to call a function.
-   `"required"`: Forces the model to call one or more functions.
-   `"none"`: Disables function calling entirely.
-   `{"type": "function", "function": {"name": "my_function"}}`: Forces the model to call a specific function.

**Parallel Function Calling** is enabled by default, allowing the model to request multiple tool calls in a single turn.

## 5. Key Feature: Structured Outputs

This feature guarantees that the API returns a response in a specific, organized format like JSON, matching a schema you define (using Pydantic or Zod). This is ideal for tasks like document parsing and entity extraction.

-   **Supported Models**: All language models later than `grok-2-1212` and `grok-2-vision-1212`.
-   **Supported Schemas**: `string`, `number` (integer, float), `object`, `array`, `boolean`, `enum`, `anyOf`.
-   **Not Supported**: `allOf`, and properties like `minLength`, `maxLength`, `minItems`, `maxItems`.

#### Example: Invoice Parsing
1.  **Define Schema**: Create a Pydantic `BaseModel` that defines the structure of an invoice (vendor name, address, line items, etc.).
2.  **Prepare Prompt**: Provide a system prompt instructing the model to extract data and a user prompt containing the raw invoice text.
3.  **Parse**: Use the `chat.parse(Invoice)` method. It returns a tuple containing the full response object and the parsed, type-safe Pydantic object.

## 6. Key Feature: Streaming Responses

Streaming allows you to receive the model's output in real-time as it's being generated, using Server-Sent Events (SSE).

-   **Enable Streaming**: Set `stream: true` in your request.
-   **Important**: When using reasoning models, **manually override the request timeout** to a longer duration (e.g., `timeout=3600`) to prevent premature connection closure.
-   **Processing**: Iterate through the stream to get `chunk` objects. The `response` object auto-accumulates the chunks.

```python
for response, chunk in chat.stream():
    print(chunk.content, end="", flush=True) # Print each chunk as it arrives

print(response.content) # The full, final response
```

## 7. Core Concept: Reasoning

Reasoning models like `grok-4` think through problems step-by-step before delivering an answer.

-   **Reasoning Trace**: The model's "thoughts" are available via `message.reasoning_content` in the response. This is useful for debugging the model's logic.
-   **Encrypted Reasoning**: `grok-4` does not return `reasoning_content` directly. Instead, it can return `encrypted_reasoning_content` if `use_encrypted_content=True`. This encrypted content can be passed back in subsequent calls to provide more context, especially when using the Stateful Responses API.
-   **Token Consumption**: Reasoning tokens are separate from completion tokens and are added to your final consumption amount. More complex problems will use more reasoning tokens.
-   **`reasoning_effort`**: This parameter (`low` or `high`) controls how much time the model spends thinking. **Note: It is NOT supported by `grok-4`.**

## 8. API Interaction Model: Stateful Responses API

This API provides a stateful way to interact with models, where previous prompts, reasoning content, and responses are saved by xAI. This simplifies conversation management.

-   **How it Works**: Instead of resending the entire conversation history, you create a new chat turn by providing the `previous_response_id`.
-   **Storage**: Responses are stored for **30 days**.
-   **Billing**: You are still billed for the entire conversation history, but costs may be reduced due to automatic caching.
-   **Usage**:
    1.  **Create**: `chat = client.chat.create(model="grok-4", store_messages=True)`
    2.  **Chain**: `chat = client.chat.create(model="grok-4", previous_response_id=response.id, ...)`
    3.  **Retrieve**: `client.chat.get_stored_completion("<response_id>")`
    4.  **Delete**: `client.chat.delete_stored_completion("<response_id>")`

## 9. General Best Practices & Considerations

-   **Optimize for Cache Hits**: When using agentic models that make multiple tool calls, avoid changing or augmenting the prompt history. Keeping the prefix of the conversation the same allows the system to use caching, which significantly speeds up inference.
-   **Introduce Context Clearly**: For developers building agents, use XML tags or Markdown to mark different sections of context in the initial prompt to improve the model's understanding.
-   **Give Detailed System Prompts**: A thorough system prompt describing the task, expectations, and edge cases can make a night-and-day difference in performance.Of course. Here is a detailed `info.md` file that synthesizes all the important information about the Grok API from the provided documents.

---

# Grok API: Comprehensive Guide

This guide provides a detailed overview of the Grok API, covering its models, core features, best practices, and advanced usage patterns. It synthesizes information on prompt engineering, agentic tools (Search, Code Execution), structured outputs, streaming, reasoning, function calling, and stateful interactions.

## Table of Contents
1.  [Models Overview](#1-models-overview)
2.  [Core Principles: Prompt Engineering](#2-core-principles-prompt-engineering)
3.  [Key Feature: Agentic Tool Calling (Server-Side)](#3-key-feature-agentic-tool-calling-server-side)
    -   [Search Tools (Web & X)](#search-tools-web--x)
    -   [Code Execution Tool](#code-execution-tool)
    -   [Advanced Usage: Multiple Tools & Image Integration](#advanced-usage-multiple-tools--image-integration)
4.  [Key Feature: Function Calling (Client-Side)](#4-key-feature-function-calling-client-side)
5.  [Key Feature: Structured Outputs](#5-key-feature-structured-outputs)
6.  [Key Feature: Streaming Responses](#6-key-feature-streaming-responses)
7.  [Core Concept: Reasoning](#7-core-concept-reasoning)
8.  [API Interaction Model: Stateful Responses API](#8-api-interaction-model-stateful-responses-api)
9.  [General Best Practices & Considerations](#9-general-best-practices--considerations)

---

## 1. Models Overview

The Grok API offers several models tailored for different tasks:

-   **`grok-code-fast-1`**: A lightweight, highly efficient agentic model designed for pair-programming and day-to-day coding tasks. It excels at rapid iteration and is significantly faster and more cost-effective than other agentic models.
-   **`grok-4-fast`**: An agentic model trained to excel at using tools, particularly for search and code execution. It's the ideal choice for navigating large codebases or the web to find precise answers.
-   **`grok-4`**: A powerful model suited for one-shot Q&A, deep conceptual understanding, and tough debugging when all necessary context is provided upfront. It features a "Think Before Responding" capability.
-   **`grok-2-1212` / `grok-2-vision-1212` and later**: These models and their successors support the Structured Outputs feature.

## 2. Core Principles: Prompt Engineering

Effective prompting is crucial for getting the best results, especially from `grok-code-fast-1`.

### a. Provide Necessary Context
-   **Bad Prompt**: `Make error handling better`
-   **Good Prompt**: `My error codes are defined in @errors.ts, can you use that as reference to add proper error handling and error codes to @sql.ts where I am making queries`
> **Best Practice**: Be specific. Select the exact code, file paths, project structures, or dependencies you want the model to use as context. This focuses the model and prevents irrelevant output.

### b. Set Explicit Goals and Requirements
-   **Bad Prompt**: `Create a food tracker`
-   **Good Prompt**: `Create a food tracker which shows the breakdown of calorie consumption per day divided by different nutrients when I enter a food item. Make it such that I can see an overview as well as get high level trends.`
> **Best Practice**: Clearly define your goals and the specific problem to be solved. Detailed, concrete queries lead to better performance.

### c. Continually Refine Your Prompts
`grok-code-fast-1` is designed for rapid and affordable iteration. If the initial output isn't perfect, refine your query by adding more context or referencing the specific failures from the first attempt.
-   **Example Refinement**: `The previous approach didn't consider the IO heavy process which can block the main thread, we might want to run it in its own threadloop such that it does not block the event loop instead of just using the async lib version`

## 3. Key Feature: Agentic Tool Calling (Server-Side)

Agentic tool calling allows the model to use powerful, server-side tools to perform complex tasks like searching the web, analyzing data, and executing code. This is a core strength of `grok-4-fast`. *Requires `xai-sdk` version 1.3.0 or later.*

### Search Tools (Web & X)

The model can iteratively call search tools, analyze responses, and make follow-up queries to find information.

-   **Web Search (`web_search`)**: Allows the agent to search the web and browse pages.
-   **X Search (`x_search`)**: Allows the agent to perform keyword, semantic, and user searches on X.

#### Retrieving Citations
Citations provide traceability for sources used during a search. They are accessible from the response object (`response.citations`). Note that the array contains all sources the agent encountered, not all of which may be relevant to the final answer.

#### Search Filters
You can narrow the search space using optional parameters for each tool.

| Tool        | Supported Filter Parameters                                                                            |
|-------------|--------------------------------------------------------------------------------------------------------|
| **Web Search**  | `allowed_domains`, `excluded_domains`, `enable_image_understanding`                                    |
| **X Search**    | `allowed_x_handles`, `excluded_x_handles`, `from_date`, `to_date`, `enable_image_understanding`, `enable_video_understanding` |

-   **Domain/Handle Filtering**: Limit searches to a maximum of 5 allowed/excluded domains or 10 X handles. `allowed` and `excluded` parameters cannot be used together in the same request.
-   **Date Range**: Restrict X searches to a specific date range using `from_date` and `to_date` (ISO8601 format or `datetime` objects in Python SDK).
-   **Image/Video Understanding**: Setting `enable_image_understanding=True` or `enable_video_understanding=True` equips the agent with tools (`view_image`, `view_x_video`) to analyze visual content, increasing token usage.

### Code Execution Tool

The `code_execution` tool (named `code_interpreter` in the OpenAI compatible API) enables Grok to write and execute Python code in a secure, sandboxed environment.

#### Key Capabilities
-   **Mathematical Computations**: Solve complex equations, perform statistical analysis.
-   **Data Analysis**: Process datasets and extract insights from prompts.
-   **Financial Modeling**: Build models, calculate risk metrics.
-   **Code Generation & Testing**: Write, test, and debug Python snippets in real-time.

#### Best Practices for Code Execution
1.  **Be Specific**: Instead of "Analyze this data," ask "Calculate the correlation matrix for these variables and highlight correlations above 0.7".
2.  **Provide Context**: Specify data formats and constraints. E.g., "Here's my CSV data with columns: date, revenue, costs..."
3.  **Use Appropriate Model Settings**: Use a low `temperature` (0.0-0.3) for mathematical precision and use reasoning models like `grok-4-fast`.

#### Limitations
-   **Environment**: Code runs in a sandboxed Python environment with common libraries (NumPy, Pandas, Matplotlib, SciPy) pre-installed.
-   **No Network/File Access**: The environment has no access to external networks or file systems for security.
-   **Stateless**: The execution context does not persist between requests.

### Advanced Usage: Multiple Tools & Image Integration

#### Requests with Multiple Active Tools
You can activate multiple tools simultaneously by including them in the `tools` array of your request. The model will intelligently orchestrate between them based on the task.

**Example Tool Combinations:**
```python
# For research and data analysis
research_setup = [web_search(), code_execution()]

# For aggregating news and social media
news_setup = [web_search(), x_search()]

# For comprehensive analysis
comprehensive_setup = [web_search(), x_search(), code_execution()]
```

#### Image Integration
Include images in your tool-enabled conversations for visual analysis and context-aware searches.

```python
from xai_sdk.chat import image, user

chat.append(
    user(
        "Search the internet and tell me what kind of dog is in the image below.",
        image("https://.../image.jpg")
    )
)
```

## 4. Key Feature: Function Calling (Client-Side)

Function calling allows you to connect the model to your own external tools and APIs. It follows a Remote Procedure Call (RPC) pattern.

#### The Flow
1.  **Initial Request**: You send a user prompt along with a list of `tool_definitions` (functions the model can call, defined with Pydantic or as a raw JSON schema).
2.  **Model Response**: If the model decides to use a tool, it responds with a `tool_calls` object containing the function name and arguments it wants to execute.
3.  **Execute & Respond**: Your code parses the `tool_calls` object, executes the corresponding local function with the provided arguments, and sends the result back to the model in a new request with `role: "tool"`.
4.  **Final Answer**: The model uses the function's output to formulate and deliver the final user-facing answer.

#### Function Calling Modes (`tool_choice`)
-   `"auto"` (Default): The model decides whether to call a function.
-   `"required"`: Forces the model to call one or more functions.
-   `"none"`: Disables function calling entirely.
-   `{"type": "function", "function": {"name": "my_function"}}`: Forces the model to call a specific function.

**Parallel Function Calling** is enabled by default, allowing the model to request multiple tool calls in a single turn.

## 5. Key Feature: Structured Outputs

This feature guarantees that the API returns a response in a specific, organized format like JSON, matching a schema you define (using Pydantic or Zod). This is ideal for tasks like document parsing and entity extraction.

-   **Supported Models**: All language models later than `grok-2-1212` and `grok-2-vision-1212`.
-   **Supported Schemas**: `string`, `number` (integer, float), `object`, `array`, `boolean`, `enum`, `anyOf`.
-   **Not Supported**: `allOf`, and properties like `minLength`, `maxLength`, `minItems`, `maxItems`.

#### Example: Invoice Parsing
1.  **Define Schema**: Create a Pydantic `BaseModel` that defines the structure of an invoice (vendor name, address, line items, etc.).
2.  **Prepare Prompt**: Provide a system prompt instructing the model to extract data and a user prompt containing the raw invoice text.
3.  **Parse**: Use the `chat.parse(Invoice)` method. It returns a tuple containing the full response object and the parsed, type-safe Pydantic object.

## 6. Key Feature: Streaming Responses

Streaming allows you to receive the model's output in real-time as it's being generated, using Server-Sent Events (SSE).

-   **Enable Streaming**: Set `stream: true` in your request.
-   **Important**: When using reasoning models, **manually override the request timeout** to a longer duration (e.g., `timeout=3600`) to prevent premature connection closure.
-   **Processing**: Iterate through the stream to get `chunk` objects. The `response` object auto-accumulates the chunks.

```python
for response, chunk in chat.stream():
    print(chunk.content, end="", flush=True) # Print each chunk as it arrives

print(response.content) # The full, final response
```

## 7. Core Concept: Reasoning

Reasoning models like `grok-4` think through problems step-by-step before delivering an answer.

-   **Reasoning Trace**: The model's "thoughts" are available via `message.reasoning_content` in the response. This is useful for debugging the model's logic.
-   **Encrypted Reasoning**: `grok-4` does not return `reasoning_content` directly. Instead, it can return `encrypted_reasoning_content` if `use_encrypted_content=True`. This encrypted content can be passed back in subsequent calls to provide more context, especially when using the Stateful Responses API.
-   **Token Consumption**: Reasoning tokens are separate from completion tokens and are added to your final consumption amount. More complex problems will use more reasoning tokens.
-   **`reasoning_effort`**: This parameter (`low` or `high`) controls how much time the model spends thinking. **Note: It is NOT supported by `grok-4`.**

## 8. API Interaction Model: Stateful Responses API

This API provides a stateful way to interact with models, where previous prompts, reasoning content, and responses are saved by xAI. This simplifies conversation management.

-   **How it Works**: Instead of resending the entire conversation history, you create a new chat turn by providing the `previous_response_id`.
-   **Storage**: Responses are stored for **30 days**.
-   **Billing**: You are still billed for the entire conversation history, but costs may be reduced due to automatic caching.
-   **Usage**:
    1.  **Create**: `chat = client.chat.create(model="grok-4", store_messages=True)`
    2.  **Chain**: `chat = client.chat.create(model="grok-4", previous_response_id=response.id, ...)`
    3.  **Retrieve**: `client.chat.get_stored_completion("<response_id>")`
    4.  **Delete**: `client.chat.delete_stored_completion("<response_id>")`

## 9. General Best Practices & Considerations

-   **Optimize for Cache Hits**: When using agentic models that make multiple tool calls, avoid changing or augmenting the prompt history. Keeping the prefix of the conversation the same allows the system to use caching, which significantly speeds up inference.
-   **Introduce Context Clearly**: For developers building agents, use XML tags or Markdown to mark different sections of context in the initial prompt to improve the model's understanding.
-   **Give Detailed System Prompts**: A thorough system prompt describing the task, expectations, and edge cases can make a night-and-day difference in performance.