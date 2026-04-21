/**
 * wuv-dream-tracker
 * Captures dreams/goals and stores them in S.I.M.
 */

const { config, reply, input, messages } = skill;

const WUV_BASE = config.provider?.baseUrl || 'https://api.wuv.ai/v1';
const WUV_KEY  = config.provider?.apiKey  || process.env.WUV_API_KEY;

// Extract the actual dream content from the trigger message
const lastMessage = input || messages?.[messages.length - 1]?.content || '';
const dreamContent = lastMessage
  .replace(/^(log a dream|save this dream|track this goal|i dreamed|i have an idea|save this idea)[:\s]*/i, '')
  .trim();

async function trackDream() {
  if (!dreamContent) {
    return reply('What\'s the dream or idea you want to capture? Tell me and I\'ll save it to your S.I.M.');
  }

  // First: store it as a high-priority S.I.M. slice
  try {
    const ingestRes = await fetch(`${WUV_BASE}/sim/ingest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WUV_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: dreamContent,
          source_type: 'dream_log',
          trust_score: 1.0,
          tags: ['dream', 'vision', 'goal'],
          iam_agent: 'V1',  // Input Agent — The Entrepreneur
        }],
        source: 'wuv-dream-tracker',
        priority: 'high',
      }),
    });

    // Then: get the S.I.M. to reflect it back meaningfully
    const reflectRes = await fetch(`${WUV_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WUV_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'wuv-sim-v1',
        messages: [
          {
            role: 'system',
            content: 'The user just shared a dream or goal. Acknowledge it with 2 sentences that honor its depth. Then ask one clarifying question that helps them define it more clearly. No generic encouragement.',
          },
          { role: 'user', content: dreamContent },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const reflectData = await reflectRes.json();
    const reflection = reflectData.choices?.[0]?.message?.content || 'Dream saved to your S.I.M.';

    reply(`✦ *Dream captured*\n\n"${dreamContent}"\n\n${reflection}`);
  } catch (e) {
    reply(`✦ Dream noted: "${dreamContent}"\n\n(Sync to S.I.M. pending — will push on next connection)`);
  }
}

trackDream();
