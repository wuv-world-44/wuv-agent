#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# wuv-agent Installer
# Works on: wuv OS, Ubuntu 22+, Debian 12+, macOS 13+
# ─────────────────────────────────────────────────────────────
set -euo pipefail

WUV_BLUE='\033[0;34m'
WUV_GREEN='\033[0;32m'
WUV_YELLOW='\033[1;33m'
WUV_RED='\033[0;31m'
NC='\033[0m'

echo -e "${WUV_BLUE}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║       wuv-agent Installer            ║"
echo "  ║   Personal S.I.M. Companion Layer    ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${NC}"

# ── Detect OS ──────────────────────────────────────────────
OS="linux"
if [[ "$OSTYPE" == "darwin"* ]]; then OS="macos"; fi
echo -e "${WUV_BLUE}► OS detected: $OS${NC}"

# ── Check Node.js ──────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${WUV_YELLOW}► Node.js not found. Installing...${NC}"
  if [[ "$OS" == "linux" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif [[ "$OS" == "macos" ]]; then
    if command -v brew &>/dev/null; then
      brew install node@22
    else
      echo -e "${WUV_RED}✗ Please install Node.js 22+ from https://nodejs.org${NC}"
      exit 1
    fi
  fi
fi

NODE_VER=$(node --version)
echo -e "${WUV_GREEN}✓ Node.js $NODE_VER${NC}"

# ── Install OpenClaw ───────────────────────────────────────
echo -e "${WUV_BLUE}► Installing OpenClaw runtime...${NC}"
npm install -g openclaw@latest --silent
echo -e "${WUV_GREEN}✓ OpenClaw installed${NC}"

# ── Create config directory ────────────────────────────────
WUV_CONFIG_DIR="$HOME/.openclaw"
WUV_SKILLS_DIR="$HOME/.openclaw/skills"
mkdir -p "$WUV_CONFIG_DIR" "$WUV_SKILLS_DIR"

# ── Prompt for API key ─────────────────────────────────────
echo ""
echo -e "${WUV_YELLOW}Your wuv API key is available at: https://admin.wuv.ai${NC}"
echo -n "► Enter your wuv API key (wuv-sk-...): "
read -r WUV_API_KEY

if [[ -z "$WUV_API_KEY" ]]; then
  echo -e "${WUV_RED}✗ API key required. Run the installer again with your key.${NC}"
  exit 1
fi

# ── Write config ───────────────────────────────────────────
CONFIG_SRC="$(dirname "$0")/../config/wuv-config.yaml"
if [[ -f "$CONFIG_SRC" ]]; then
  sed "s|\${WUV_API_KEY}|$WUV_API_KEY|g" "$CONFIG_SRC" > "$WUV_CONFIG_DIR/config.yaml"
else
  # Inline fallback config
  cat > "$WUV_CONFIG_DIR/config.yaml" << YAML
agent:
  name: "wuv Companion"
  persona: |
    You are the user's personal S.I.M. companion. You carry memory of who they are,
    what they care about, and where they're going. You speak with warmth and purpose.

provider:
  name: wuv
  baseUrl: https://api.wuv.ai/v1
  apiKey: "${WUV_API_KEY}"
  model: wuv-sim-v1
  stream: true

gateway:
  port: 18789
  daemon: true
  logLevel: info

skills:
  - wuv-memory-sync
  - wuv-ark-companion
  - wuv-dream-tracker
  - wuv-family-pulse
  - wuv-focus-mode
YAML
  sed -i "s|\${WUV_API_KEY}|$WUV_API_KEY|g" "$WUV_CONFIG_DIR/config.yaml"
fi
echo -e "${WUV_GREEN}✓ Config written to $WUV_CONFIG_DIR/config.yaml${NC}"

# ── Install wuv Skills ─────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo -e "${WUV_BLUE}► Installing wuv skills...${NC}"
for SKILL in wuv-memory-sync wuv-ark-companion wuv-dream-tracker wuv-family-pulse wuv-focus-mode; do
  SKILL_SRC="$SCRIPT_DIR/skills/$SKILL"
  if [[ -d "$SKILL_SRC" ]]; then
    cp -r "$SKILL_SRC" "$WUV_SKILLS_DIR/"
    echo -e "${WUV_GREEN}  ✓ $SKILL${NC}"
  fi
done

# ── Install systemd daemon (Linux) ─────────────────────────
if [[ "$OS" == "linux" ]]; then
  echo -e "${WUV_BLUE}► Installing systemd service...${NC}"
  SYSTEMD_DIR="$HOME/.config/systemd/user"
  mkdir -p "$SYSTEMD_DIR"
  cat > "$SYSTEMD_DIR/wuv-agent.service" << SERVICE
[Unit]
Description=wuv Agent — Personal S.I.M. Companion
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=$(which openclaw) gateway --config $WUV_CONFIG_DIR/config.yaml --port 18789
Restart=always
RestartSec=5
Environment=HOME=$HOME
Environment=WUV_API_KEY=$WUV_API_KEY

[Install]
WantedBy=default.target
SERVICE

  systemctl --user daemon-reload
  systemctl --user enable wuv-agent
  systemctl --user start wuv-agent
  echo -e "${WUV_GREEN}✓ wuv-agent service enabled and started${NC}"
fi

# ── Install launchd daemon (macOS) ─────────────────────────
if [[ "$OS" == "macos" ]]; then
  echo -e "${WUV_BLUE}► Installing launchd service...${NC}"
  PLIST_DIR="$HOME/Library/LaunchAgents"
  mkdir -p "$PLIST_DIR"
  cat > "$PLIST_DIR/ai.wuv.agent.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>ai.wuv.agent</string>
  <key>ProgramArguments</key>
  <array>
    <string>$(which openclaw)</string>
    <string>gateway</string>
    <string>--config</string>
    <string>$WUV_CONFIG_DIR/config.yaml</string>
    <string>--port</string>
    <string>18789</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>EnvironmentVariables</key>
  <dict>
    <key>WUV_API_KEY</key><string>$WUV_API_KEY</string>
  </dict>
</dict>
</plist>
PLIST
  launchctl load "$PLIST_DIR/ai.wuv.agent.plist"
  echo -e "${WUV_GREEN}✓ wuv-agent launchd service loaded${NC}"
fi

# ── Done ───────────────────────────────────────────────────
echo ""
echo -e "${WUV_GREEN}╔══════════════════════════════════════════════════╗"
echo -e "║   ✓ wuv-agent installed successfully!           ║"
echo -e "╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Gateway: ${WUV_BLUE}http://localhost:18789${NC}"
echo -e "  Config:  ${WUV_BLUE}$WUV_CONFIG_DIR/config.yaml${NC}"
echo -e "  API:     ${WUV_BLUE}https://api.wuv.ai/v1${NC}"
echo ""
echo -e "  Next steps:"
echo -e "  1. Connect Telegram: ${WUV_YELLOW}openclaw channels add telegram${NC}"
echo -e "  2. Test your S.I.M.: ${WUV_YELLOW}openclaw agent --message 'Hello wuv'${NC}"
echo -e "  3. View dashboard:   ${WUV_YELLOW}https://admin.wuv.ai${NC}"
echo ""
