# ⠶ Braille Input Helper

A VS Code extension for **6-dot braille input** with multi-mode support. Type braille directly into your editor using your keyboard — no special hardware needed.

## How It Works

This extension turns your keyboard into a braille writer. Press keys simultaneously (like a Perkins brailler) to form braille cells, and the corresponding print characters appear in your editor.

### Default Key Layout (`fds-jkl`)

```
Left hand     Right hand
┌───┬───┬───┐ ┌───┬───┬───┐
│ S │ D │ F │ │ J │ K │ L │
│ ③ │ ② │ ① │ │ ④ │ ⑤ │ ⑥ │
└───┴───┴───┘ └───┴───┴───┘
       Space = ⓪ (word separator)
```

**Example:** Press `F` + `J` simultaneously → dots 1+4 → outputs `c`

## Getting Started

1. Install the extension
2. Open any text file
3. Run **"Braille: Toggle Braille Input Mode"** from the Command Palette (`Cmd+Shift+P`)
4. Start typing braille chords!

The status bar shows your current mode: **⠶ G1** (Grade 1), **⠶ G2** (Grade 2), **⠶ かな** (Kana), or **⠶ Math** (Nemeth).

## Modes

This extension uses **UEB Grade 1** as its base mode and supports switching to other braille systems via indicator sequences.

| Mode        | Description                   | Enter               | Exit                   |
| ----------- | ----------------------------- | ------------------- | ---------------------- |
| **Grade 1** | UEB uncontracted (default)    | Base mode           | —                      |
| **Grade 2** | UEB contracted                | ⠰⠅ (dots 56 + 13)   | ⠰⠅⠄ (dots 56 + 13 + 3) |
| **Kana**    | Japanese braille (日本語点字) | ⠡⠅ (dots 16 + 13)   | ⠡⠅⠄ (dots 16 + 13 + 3) |
| **Nemeth**  | Math & science notation       | ⠸⠩ (dots 456 + 146) | ⠸⠱ (dots 456 + 156)    |

> **Design Note:** Unlike many braille apps that default to Grade 2, this extension uses **Grade 1 as the base** and treats Grade 2 as a switchable mode via the custom indicator ⠰⠅ (dots 56 + 13). This avoids ambiguity between contractions and literal characters.

## Key Indicators

### Modifiers (apply to the next character)

| Indicator       | Dots      | Braille | Effect                       |
| --------------- | --------- | ------- | ---------------------------- |
| Capital letter  | 6         | ⠠       | Capitalizes next letter      |
| Capital word    | 6 + 6     | ⠠⠠      | Capitalizes entire word      |
| Capital passage | 6 + 6 + 6 | ⠠⠠⠠     | Capitalizes until terminator |
| Numeric         | 3456      | ⠼       | Numbers follow (a=1, b=2…)   |

### Typeform Indicators

| Style     | Symbol (1 char) | Word    | Passage    | Terminator |
| --------- | --------------- | ------- | ---------- | ---------- |
| Italic    | 46 + 23         | 46 + 2  | 46 + 2356  | 46 + 3     |
| Bold      | 45 + 23         | 45 + 2  | 45 + 2356  | 45 + 3     |
| Underline | 456 + 23        | 456 + 2 | 456 + 2356 | 456 + 3    |

## Custom Mappings

To avoid dot-pattern conflicts between indicators and characters, some symbols use custom multi-cell sequences:

| Symbol      | Standard UEB | This Extension  | Reason                                                 |
| ----------- | ------------ | --------------- | ------------------------------------------------------ |
| **?**       | 236          | **56 + 236** ⠰⠦ | Dots 236 conflicts with left double quotation mark `"` |
| **Grade 2** | N/A          | **56 + 13** ⠰⠅  | Custom mode indicator                                  |
| **Kana**    | N/A          | **16 + 13** ⠡⠅  | Custom mode indicator                                  |

## Common Punctuation (Grade 1)

| Character       | Dots     | Braille |
| --------------- | -------- | ------- |
| , (comma)       | 2        | ⠂       |
| ; (semicolon)   | 23       | ⠆       |
| : (colon)       | 25       | ⠒       |
| . (period)      | 256      | ⠲       |
| ! (exclamation) | 235      | ⠖       |
| ? (question)    | 56 + 236 | ⠰⠦      |
| ' (apostrophe)  | 3        | ⠄       |
| - (hyphen)      | 36       | ⠤       |
| " (open quote)  | 236      | ⠦       |
| " (close quote) | 356      | ⠴       |
| (               | 5 + 126  | ⠐⠣      |
| )               | 5 + 345  | ⠐⠜      |
| / (slash)       | 456 + 34 | ⠸⠌      |

## Braille Overlay

The extension can display **Unicode braille dots** alongside your text as inline decorations, so you can see both the print output and the original braille simultaneously.

Toggle it with **"Braille: Toggle Braille Overlay"** from the Command Palette.

## Settings

| Setting                      | Default   | Description                                     |
| ---------------------------- | --------- | ----------------------------------------------- |
| `braille.keyLayout`          | `fds-jkl` | Key layout (`fds-jkl` or `dwq-kop`)             |
| `braille.chordTimeout`       | `50`      | Time window (ms) for simultaneous key detection |
| `braille.showBrailleOverlay` | `true`    | Show braille dots overlay                       |

## Commands

| Command                              | Description                       |
| ------------------------------------ | --------------------------------- |
| `Braille: Toggle Braille Input Mode` | Enable/disable braille input      |
| `Braille: Toggle Braille Overlay`    | Show/hide braille dot decorations |

## Architecture

The extension is built with a modular, layered architecture:

```
Input Layer        → ChordDetector (key → dot chords)
Engine Layer       → MultiCellMatcher → IndicatorMatcher → StateMachine
Data Layer         → UnifiedTable (merges all braille profiles)
Output Layer       → EditorOutput + BrailleTracker + BrailleOverlay
```

Braille data is stored as JSON profiles organized by system (`ueb/`, `kana/`, `nemeth/`), making it easy to extend with new braille systems.

## Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Run tests
npm test

# Watch mode
npm run watch
```

## License

MIT
