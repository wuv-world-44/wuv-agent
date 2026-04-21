/**
 * wuv-family-pulse
 * Weekly family check-in + S.I.M. pattern tracking
 */

const { config, reply } = skill;

const WUV_BASE = config.provider?.baseUrl || 'https://api.wuv.ai/v1';
const WUV_KEY  = config.provider?.apiKey  || process.env.WUV_API_KEY;

const PULSE_PROMPT = `
You are facilitating a weekly family pulse check for the user.
Draw from their S.I.M. memory about their family — names, dynamics, recent themes.

Ask 3 check-in questions, one at a time would be ideal, but for this brief return all 3:
1. One about the family's emotional state this week
2. One about a specific family member they've mentioned before (use their name)
3. One about progress toward a shared family goal or healing pattern they've been working on

Keep it warm, direct, and personal. Max 5 sentences total.
`.trim();

async function familyPulse() {
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
          { role: 'system', content: PULSE_PROMPT },
          { role: 'user', content: 'Family pulse check — Friday.' },
        ],
        max_tokens: 250,
        temperature: 0.75,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const pulse = data.choices?.[0]?.message?.content || 'How is your family doing this week?';

    reply(`💚 *Family Pulse — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}*\n\n${pulse}`);
  } catch (e) {
    reply(`💚 *Family Pulse*\n\nHow is your family doing this week? What's one thing you want to acknowledge about them?`);
  }
}

familyPulse();
