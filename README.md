# Roblox Claude App

This repository contains a simple MVP app that lets you:
- write a prompt in a UI,
- send it to Claude,
- generate Roblox Lua or GUI code,
- save it to a target path like `StarterPlayerScripts`, `StarterGui`, or a custom export folder,
- export a ZIP/MCP package.

## Quick start

1. Copy `.env.example` to `.env.local`
2. Add your Anthropic API key to `CLAUDE_API_KEY`
3. Run:
   - `npm install`
   - `npm run dev`
4. Open `http://localhost:3000`

## Features

- Prompt form for Roblox generation
- Claude API integration
- Safe output validation
- Save generated code into `/output/<target>/`
- ZIP export for custom MCP-style packaging

## Notes

This is an MVP and needs additional work for full Roblox deployment automation.
For production, you will likely want:
- a real Roblox deploy pipeline,
- stronger validation and linting for Lua,
- GitHub integration or automation,
- optional preview/approval flow before writing to live project paths.

## Example targets

- `StarterPlayerScripts`
- `StarterGui`
- `RojoFolder`
- `CustomExport`
