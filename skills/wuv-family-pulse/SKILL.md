---
name: wuv-family-pulse
version: 1.0.0
description: Weekly family check-in prompts, tracks responses, surfaces patterns in S.I.M.
triggers:
  - phrase: "family check in"
  - phrase: "family pulse"
  - phrase: "how is the family"
  - schedule: "0 18 * * 5"
permissions:
  - network
  - schedule
---

# wuv Family Pulse

Weekly check-in for family alignment and wellbeing.
Surfaces patterns over time in your S.I.M. Designed for
families healing generational cycles and staying connected.

## Usage

- Runs automatically every Friday at 6 PM
- Say "family check in" to run manually
- Responses are stored in S.I.M. and analyzed for patterns

## What it tracks

- How each family member is doing
- Points of connection and friction
- Progress on shared goals
- Emotional temperature of the family system
