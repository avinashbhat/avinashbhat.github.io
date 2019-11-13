---
title: "WikiContext"
layout: post
date: 2019-07-15 15:30
tag:
- projects
- Text Summarization
- Machine Learning
category: project
author: avinashbhat
---

## [WikiContext](https://avinashbhat.github.io/wikicontext/)

Wikipedia articles are hardly lucid. There is always some kind of jargon which floats around, which is difficult to understand in layman's term. This is an attempt to simplify the understanding of any Wikipedia article by providing a summary of some of the key concepts of the said article.
We provide the context, hence the name WikiContext.

### Beneath the hood

WikiContext makes use of extractive text summarization, using [TextRank](https://www.aclweb.org/anthology/W04-3252). First step is to define a keyword list based on the hyperlinks present in the article. Once this is done, based on [keyword ranking](http://ceur-ws.org/Vol-706/poster13.pdf), we identify the most relevent keywords in the article. Then the data is fetched and the summarization is performed.
