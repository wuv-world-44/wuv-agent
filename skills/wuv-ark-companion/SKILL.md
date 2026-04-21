---
name: wuv-ark-companion
version: 1.0.0
description: Daily morning intention, IAM lens, and Ark of Dreams guidance from your S.I.M.
triggers:
  - phrase: "good morning"
  - phrase: "daily intention"
  - phrase: "what's my focus today"
  - phrase: "ark check in"
  - schedule: "0 7 * * *"
permissions:
  - network
  - schedule
---

# wuv Ark Companion

Your daily morning connection to the Ark of Dreams.
Surfaces your current IAM lens, sets an intention for the day,
and sends a message through your connected channels (Telegram by default).

## Usage

- Runs automatically at 7 AM
- Say "good morning" to trigger manually
- Say "what's my focus today" for your IAM lens
