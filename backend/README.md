## Reflection Questions - Prepared Answers

### 1. Why approximate 1 token ≈ 4 characters?

**Answer:** This is a rough heuristic based on how GPT tokenizers work. The OpenAI/Anthropic tokenizers use BPE (Byte Pair Encoding) where common words become single tokens, but rare words get split. On average, for English text, ~4 characters ≈ 1 token works reasonably well.

**Breakdown for Legal Language:**

- Legal text often has long, formal words ("indemnification", "notwithstanding")
- Latin phrases ("inter alia", "pro rata") tokenize inefficiently
- Heavy use of punctuation and formatting
- This means legal text likely uses **more tokens per character** than average
- Our approximation would **undercharge** lawyers, potentially losing revenue

### 2. Different models (GPT-3.5 vs GPT-4) implications?

**Answer:** Would need model-specific rates:

```python
MODEL_RATES = {
    "gpt-3.5-turbo": 20,   # Cheaper
    "gpt-4": 60,           # More expensive
    "gpt-4-turbo": 40,     # Middle ground
    "claude-3-opus": 75,   # Premium
}

def calculate_credits(text: str, model: str) -> float:
    rate = MODEL_RATES.get(model, 40)
    tokens = len(text) / 4
    return max(1.0, round((tokens / 100) * rate, 2))
```

### 3. Improving token estimation in production?

**Answer:** Use the actual tokenizer library:

```python
import tiktoken

encoder = tiktoken.encoding_for_model("gpt-4")

def count_tokens_exact(text: str) -> int:
    return len(encoder.encode(text))
```

For Anthropic: Use their tokenizer or API response metadata which includes actual token counts.

### 4. Caching/batching strategies for slow LLM API?

**Answer:**

- **Write-through cache:** Store token counts when response is received
- **Batch processing:** Queue messages, process in batches during off-peak
- **Predictive caching:** Pre-calculate for common report types
- **TTL-based invalidation:** Cache for 24h, messages don't change

### 5. Normalizing token billing for fairness?

**Answer:**

- **Intent-based pricing:** Simple questions (1x), complex analysis (1.5x), reports (fixed)
- **Confidence discounts:** If AI is uncertain, charge less
- **Subscription tiers:** Heavy users get volume discounts
- **Cap per query:** Maximum charge regardless of length

### 6. Explaining cost differences to lawyers?

**Answer:** Show in UI:

- Token count (or character count)
- Whether it was a report (fixed price) or question (variable)
- Breakdown: "120 tokens × $0.40/100 = $0.48, rounded to $1.00 minimum"
- Comparison to similar queries

**UI Tooltip Example:**

```
Credit Calculation:
├─ Message length: 156 characters
├─ Estimated tokens: 39
├─ Rate: 40 credits per 100 tokens
├─ Calculated: 15.60 credits
└─ Final: 15.60 credits
```

---
