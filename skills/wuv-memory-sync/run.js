/**
 * wuv-memory-sync
 * Pushes conversation context to S.I.M. via api.wuv.ai
 */

const { messages, config, reply, apiKey, companionId } = skill;

const WUV_BASE = config.provider?.baseUrl || 'https://api.wuv.ai/v1';
const WUV_KEY  = config.provider?.apiKey  || process.env.WUV_API_KEY;

async function syncMemory() {
  if (!messages || messages.length === 0) {
    return reply('No conversation to sync yet.');
  }

  // Format last N messages for S.I.M. ingestion
  const recent = messages.slice(-20).map(m => ({
    role: m.role,
    content: m.content,
    timestamp: m.timestamp || new Date().toISOString(),
    source_type: 'wuv_agent',
    trust_score: 1.0,
  }));

  try {
    const res = await fetch(`${WUV_BASE}/sim/ingest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WUV_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: recent,
        source: 'wuv-agent',
        auto_sync: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return reply(`⚠️ Sync failed: ${err}`);
    }

    const data = await res.json();
    const count = data.slices_created || recent.length;
    reply(`✓ Synced ${count} memory slice${count !== 1 ? 's' : ''} to your S.I.M.`);
  } catch (e) {
    reply(`⚠️ Could not reach api.wuv.ai — will retry next time. (${e.message})`);
  }
}

syncMemory();
