## Documentation

This document provides a brief, nearly-not-so-perfect, honest attempt, at giving an overview of using `comic-writer`.

## Table of Contents
- [Why would anyone write this way?](#)
- [How do format my document?](#)
- [A Concise Example](#)
- [Metadata: Titles, Author Name, Etc.](#)
- [Pages](#)
- [Panels](#)
- [Captions](#)
- [Dialogue](#)
- [Sound Effects](#)
- [Other](#)

## Why would anyone write this way?

Good question. The short answer is this:

> Have a robot format your document, so you can focus on your story.

Or to put it a longer way; the most frustration free to write *and* format a document is to separate *what* you're writing, from *how* you format it. Let's expand on the benefits of a workflow in this way.

**It's faster:** You're saving yourself a significant amount of time re-numbering, re-formatting, copying, pasting, changing heading sizes, the list goes on. You're no longer required to hunt and click to format your document. You *imply* it. The editor does the rest of the work that machines should do. You're not a professional typesetter, why should you do that work?

**It's easy to learn:** The price of entry required to learn the syntax of the `comic-writer`'s editor is amazingly low. You can learn it in minutes, and memorize it in an hour.

**It's raw text:** The formatting your doing lives in raw text. It's not locked up in some sort of proprietary format.

### In truth...

...the format that you'll be writing in, you may have seen it before. It's a standard called `Markdown`. The `comic-writer` provides a comic specific processing for it. We want you to focus on writing, instead of formatting.

## How do format my document?

### A Concise Example

### Metadata: Titles, Author Name, Etc.

### Pages
Type `##`, hit space. It should auto-complete to something like:
```markdown
## Page 1
```
We figure out page numbering for you, to save you time.

### Panels
Type `###`, hit space. It should, again, auto-complete to something like:
```markdown
### Panel 1
```
We figure out the panel numbering for you, to save you time and hassle.

### Captions
Captions follow a `>` + `word` + `: ` + `content` pattern. If you wanted to...

#### Dialogue
... write a dialogue, you would write:
```
> Character Name: How wonderful! It's formatting for me!
```
The preview should format everything for you. What about off screen?

```
> Character Name (off): You can hear me, but you can't see me...
```

#### Sound Effects

### Images

To insert an image into the document, you can link to it via a URL.

```
![East of West Cover #39](https://imagecomics.com/uploads/releases/EastOfWest_39-1.png)
```
It should load in the preview.

### Links

Similar to an image, you can create links in two ways:
```
[Image Comics Website](https://imagecomics.com/)
```
or you can simply paste the link itself!
```
https://imagecomics.com/
```

### Other
