---
name: wuv-memory-sync
version: 1.0.0
description: Syncs your local conversations into your S.I.M. memory at api.wuv.ai
triggers:
  - phrase: "sync memory"
  - phrase: "save this conversation"
  - phrase: "push to sim"
  - auto: afterMessages
    afterMessagesCount: 5
permissions:
  - network
  - history
---

# wuv Memory Sync

Automatically pushes conversation context to your personal S.I.M. companion
at api.wuv.ai. Runs silently after every 5 messages, or on demand.

## Usage

- Say "sync memory" to push immediately
- Say "save this conversation" to archive
- Runs automatically every 5 messages
