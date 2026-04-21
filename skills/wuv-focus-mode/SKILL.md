---
name: wuv-focus-mode
version: 1.0.0
description: Deep work session manager — silences noise, sets context in S.I.M., tracks completion
triggers:
  - phrase: "focus mode on"
  - phrase: "deep work"
  - phrase: "focus mode off"
  - phrase: "end focus"
  - phrase: "focus session"
permissions:
  - network
  - system
---

# wuv Focus Mode

Activates deep work mode. Sets a focus context tag in your S.I.M.
so your companion understands you are in a work session.
On Linux/wuv OS, also sets system DND if supported.

## Usage

- "Focus mode on" — starts a session, asks what you're working on
- "Focus mode on: [task]" — starts immediately with task context
- "Focus mode off" — ends session, logs what was accomplished
- "End focus" — same as above
