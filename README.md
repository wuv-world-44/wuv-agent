# 🌀 wuv-agent

> The local intelligence layer for wuv OS. Your S.I.M. companion, always on.

wuv-agent is a branded, pre-configured fork of [OpenClaw](https://github.com/openclaw/openclaw) — the world's most popular personal AI agent framework — pointed at `api.wuv.ai` and powered by your personal **S.I.M. (Soul Intelligence Model)** companion.

Any channel you already use — Telegram, WhatsApp, Discord, voice — becomes a portal to your S.I.M.

---

## What it does

- Connects your devices to your personal S.I.M. companion via `api.wuv.ai`
- Runs as an always-on system service (auto-starts on boot)
- Comes with 5 pre-installed wuv skills
- Integrates natively into wuv OS
- Works on any OS: Linux, macOS, Windows (WSL2)

## Architecture

```
Your device (wuv OS)
  └── wuv-agent daemon (port 18789)
        ├── Telegram / Discord / WhatsApp / Voice
        ├── wuv Skills Pack
        └── api.wuv.ai/v1 → S.I.M. Companion
```

## Quick Install (wuv OS)

```bash
curl -fsSL https://raw.githubusercontent.com/wuv-world-44/wuv-agent/main/installer/install.sh | bash
```

## Manual Install

```bash
npm install -g openclaw@latest
git clone https://github.com/wuv-world-44/wuv-agent ~/.wuv-agent
cd ~/.wuv-agent && bash installer/install.sh
```

## Pre-installed Skills

| Skill | What it does |
|---|---|
| `wuv-memory-sync` | Pushes conversations into your S.I.M. memory |
| `wuv-ark-companion` | Daily morning intention + IAM lens via Telegram |
| `wuv-dream-tracker` | Captures dreams/goals by voice or text |
| `wuv-family-pulse` | Weekly family check-ins, surfaces patterns |
| `wuv-focus-mode` | Deep work session manager |

## Configuration

Your API key and model are set during installation. To update:

```bash
nano ~/.openclaw/wuv-config.yaml
```

## Supported Channels

Telegram · WhatsApp · Discord · Slack · Voice (macOS/Linux) · Web

---

Built with ❤️ by [A.M. Technologies](https://am-technologies.com) · Powered by [wuv.ai](https://wuv.ai)
