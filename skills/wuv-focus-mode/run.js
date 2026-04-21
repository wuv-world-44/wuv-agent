/**
 * wuv-focus-mode
 * Deep work session manager
 */

const { config, reply, input, messages } = skill;

const WUV_BASE = config.provider?.baseUrl || 'https://api.wuv.ai/v1';
const WUV_KEY  = config.provider?.apiKey  || process.env.WUV_API_KEY;

const lastMessage = (input || messages?.[messages.length - 1]?.content || '').toLowerCase();
const isEnding = lastMessage.includes('off') || lastMessage.includes('end focus');

// Extract optional task from message
const taskMatch = (input || '').match(/focus mode on[:\s]+(.+)/i);
const task = taskMatch?.[1]?.trim() || null;

async function focusOn() {
  const prompt = task
    ? `The user is entering deep work on: "${task}". Give them one sharp, focused intention for this session in 2 sentences. Then say "Your S.I.M. is in focus mode." Nothing else.`
    : `The user is entering deep work mode. Ask them one question: what are they working on? Keep it to 1 sentence.`;

  try {
    // Tag S.I.M. with focus context
    await fetch(`${WUV_BASE}/sim/ingest`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WUV_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: task ? `User entered focus mode: ${task}` : 'User entered focus mode.',
          source_type: 'system_event',
          tags: ['focus_mode', 'deep_work'],
        }],
        source: 'wuv-focus-mode',
      }),
    }).catch(() => {});

    const res = await fetch(`${WUV_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WUV_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'wuv-sim-fast',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: 'Focus mode on.' },
        ],
        max_tokens: 100,
        temperature: 0.6,
      }),
    });

    const data = await res.json();
    const msg = data.choices?.[0]?.message?.content || 'Focus mode active. Go build.';
    reply(`🎯 *Focus Mode ON*\n\n${msg}`);
  } catch (e) {
    reply(`🎯 *Focus Mode ON*\n\nGo build. Your S.I.M. is with you.`);
  }
}

async function focusOff() {
  try {
    // Log session end
    await fetch(`${WUV_BASE}/sim/ingest`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WUV_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: 'User exited focus mode.',
          source_type: 'system_event',
          tags: ['focus_mode_end'],
        }],
        source: 'wuv-focus-mode',
      }),
    }).catch(() => {});

    reply(`✓ *Focus Mode OFF*\n\nGood work. What did you accomplish in that session? Tell me and I'll save it to your S.I.M.`);
  } catch (e) {
    reply(`✓ *Focus Mode OFF*\n\nGood work. Rest, then go again.`);
  }
}

if (isEnding) {
  focusOff();
} else {
  focusOn();
}
