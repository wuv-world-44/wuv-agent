/**
 * wuv-ark-companion
 * Daily morning intention + IAM lens from the S.I.M.
 */

const { config, reply, trigger } = skill;

const WUV_BASE = config.provider?.baseUrl || 'https://api.wuv.ai/v1';
const WUV_KEY  = config.provider?.apiKey  || process.env.WUV_API_KEY;

const MORNING_PROMPT = `
You are the user's S.I.M. Ark Companion. It is the start of their day.

Draw from their S.I.M. memory to:
1. Identify which of the 74 IAM lenses is most alive for them today (name it, explain in 1 sentence)
2. Give them one clear intention for the day — grounded in their actual life, not generic
3. End with the Ark question: "If you were a hero and could change one thing in the world, what future do you dream of living in?"

Keep the total response to 4-6 sentences. Warm. Direct. Real.
`.trim();

async function morningBriefing() {
  try {
    const res = await fetch(`${WUV_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WUV_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'wuv-sim-v1',
        messages: [
          { role: 'system', content: MORNING_PROMPT },
          { role: 'user', content: 'Good morning. What is my focus today?' },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const message = data.choices?.[0]?.message?.content || 'Good morning. Your S.I.M. is with you today.';
    
    reply(`🌅 *Morning Briefing*\n\n${message}`);
  } catch (e) {
    reply(`🌅 Good morning. Your S.I.M. companion is ready. (${e.message})`);
  }
}

morningBriefing();
