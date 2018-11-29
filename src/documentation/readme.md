# Comic Writer Editor Documentation

This document provides a brief, nearly-not-so-perfect, honest attempt, at giving an overview of using `comic-writer`.

## Table of Contents
- [Why would anyone write this way?](#why-would-anyone-write-this-way)
- [How do I format my document?](#how-do-i-format-my-document)
- [A Concise Example](#a-concise-example)
- [Metadata: Titles, Author Name, Etc.](#metadata-titles-author-name-etc)
- [Pages](#pages)
- [Panels](#panels)
- [Captions](#captions)
- [Dialogue](#dialogue)
- [Sound Effects](#sound-effects)
<!-- - [Other](#other) -->

## Why would anyone write this way?

Good question. The short answer is this:

> Have a robot format your document, so you can focus on your story.

Or to put it a longer way; the most frustration free to write *and* format a document is to separate *what* you're writing, from *how* you format it. Let's expand on the benefits of a workflow in this way.

**It's faster:** You're saving yourself a significant amount of time re-numbering, re-formatting, copying, pasting, changing heading sizes, the list goes on. You're no longer required to hunt and click to format your document. You *imply* it. The editor does the rest of the work that machines should do. You're not a professional typesetter; why should you do all that work?

**It's easy to learn:** The price of entry required to learn the syntax of the `comic-writer`'s editor is amazingly low. You can learn it in minutes, and memorize it in an hour.

**It's raw text:** The formatting your doing lives in raw text. It's not locked up in some sort of proprietary format. If you ever needed to, you could easily copy and paste our your script into a different tool.

## How do I format my document?

### A Concise Example

```Markdown
Title: East of West
Book: 20
Author: Mao Xiaolian
Email: mao@myotherarmisarobot.com

Page 1

Panel 1

Panel 2

Panel 3

Panel 4

Page 2

Panel 1

Panel 2

Panel 3

Panel 4

Panel 5

Panel 6

...
```
### Metadata: Titles, Author Name, Etc.

Metadata is addtional information you can provide to the editor. Some of the metadata, like `title`, will render in special ways.

```markdown
Title: East of West
Book: 20
Author: Mao Xiaolian
Email: mao@myotherarmisarobot.com
```

### Pages

Type `Page`, hit space. It should auto-complete to something like:

```markdown
Page
```
We figure out page numbering for you, to save you time. If you inject a new page, or move it, it will auto-update-automagically™.

### Panels
Type `Panel`, hit space. It should, again, auto-complete to something like:
```markdown
Panel 1
```
It will auto-update-automagically™ to the correct number, should you move content around.

### Captions
Captions follow a `<tab>` + `word` + `: ` + `content` pattern. If you wanted to...

#### Dialogue

... write a dialogue, you would write:

```
<tab>Character Name: How wonderful! It's formatting for me!
```

The preview should format everything for you. What about off screen?

```
<tab>Character Name (off): You can hear me, but you can't see me...
```

#### Sound Effects
