# Comic Writer Documentation

## Table of Contents
- [Why would anyone write this way?](#why-would-anyone-write-this-way)
- [How do I format my document?](#how-do-i-format-my-document)
- [Metadata: Titles, Author Name, Etc.](#metadata-titles-author-name-etc)
- [Pages](#pages)
- [Panels](#panels)
- [Captions](#captions)
- [Dialogue](#dialogue)
- [SFX](#sfx)
- [Bold](#bold)
- [Example](#example)
<!-- - [Other](#other) -->

## Why would anyone write this way?

Good question. The short answer is this:

> Have a computer format your document, so you can focus on your story.

Or to put it a longer way; the most frustration free to write *and* format a document is to separate *what* you're writing, from *how* you format it. Let's expand on the benefits of a workflow in this way.

**Faster:** Save yourself from numbering, formatting, copying, pasting, changing heading sizes, the list goes on.

**Easy to learn:** `comic-writer`'s syntax is simple. You can learn it in a few minutes.

**Plain text:** Your script is plain text. It's not locked up in a proprietary format. You can easily copy and paste your script into another tool.

## How do I format my document?

### Metadata: Titles, Author Name, Etc.

Metadata is addtional information about the book.

```markdown
title: East of West
issue: 20
author: Mao Xiaolian
email: mao@myotherarmisarobot.com
```

### Pages

Type `page`. It will autocomplete to:

```markdown
Page 1
```
We figure out page numbering for you. If you inject a new page, or move it, numbering will adjust accordingly.

### Panels
Type `Panel`. It will autocomplete to:

```markdown
Panel 1
```
It will automatically update to the correct number, should you move content around.

### Lettering

#### Dialogue

Press the tab key, type the character's name, a colon (`:`) and then type the dialogue.

```
<tab>CHARACTER: How wonderful! It's formatting for me!
```

You can "modify" dialogue with parenthesis after the character name.

```
<tab>CHARACTER (OFF): You can hear me, but you can't see me...

<tab>CHARACTER (WHISPER): This is quiet
```

#### Captions

Captions follow the same pattern as dialogue.

```
<tab>CAPTION: This is a caption.

<tab>CAPTION (MODIFIER): This caption has a modifier.
```

#### SFX

SFX also follow the same pattern.

```
<tab>SFX: POW

<tab>SFX (GUN): BLAM
```

#### Bold

In dialogue and captions you can surround words with `**` to make them bold.

```
<tab>CHARACTER: This is **bold**.

<tab>CAPTION: It can be **bold here** too.
```

### Example

```Markdown
Title: East of West
Book: 20
Author: Mao Xiaolian
Email: mao@myotherarmisarobot.com

Page 1

Panel 1

Panel 2

Page 2

Panel 1

...
```
