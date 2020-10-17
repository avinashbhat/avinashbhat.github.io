---
layout: post
title: Learning Program Semantics with GNNs
description: Learning Program Semantics with GNNs
summary: Learning Program Semantics with GNNs
date: 2020-10-13T00:00:00.000Z
category: blog
comments: true
tags:
  - deep-learning
  - research-watch
  - software-engineering
  - graph-neural-networks
  - code-summarization
published: false
---

> Shangqing Liu. 2020. A Unified Framework to Learn Program Semantics with Graph Neural Networks. In 35th IEEE/ACM International Conference on Automated Software Engineering (ASE ’20), September 21–25, 2020, Virtual Event, Australia. ACM, New York, NY, USA, 3 pages. https://doi.org/10.1145/ 3324884.3418924

<br>

While Graph Neural Networks have been around for couple of years now, only recently they have been applied for Software Engineering tasks. Learning program semantics is a hard problem, and a successful approch can have applications in program synthesis, summarization and many others. Graph Neural Networks make it easy to capture the semantic information in the code, and derive interesting results from it.
<br><br>
<div style="text-align:center;">
<img alt="GGraph Neural Network" src="{{site.baseurl}}/assets/images/2020-10-13-01.png"/>
</div>
<div style="width:484px height:319px; font-size:80%; text-align:center;">
	Graph Neural Network. This was taken from MSR Cambridge Lecture Series on <a href="https://www.youtube.com/watch?v=cWIeTMklzNg">Youtube</a>.
</div>
<br>

## [Abstract](#abstract)
The existing GNN based approaches ignore global relations between the nodes of the graphs, and are limited to the local neighbourhood information. This leads to a limitation in learning the semantics of the code. 

## [Introduction & Background](#intro)
Some of the major works in program semantic learning take the approach of trating a program or ASTs (which can be considered as representations of the program, for better understanding by the algorithm) and employing LSTMs or such sequential models over the tokens. However, the recent work suggests that graph based neural network models understand code better. Intuitively it makes sense, since ASTs are graphs and GNNs work on graphs; they are better suited to capture the latent features of the ASTs.

One of the challenges here is that the GNNs capture local neighbourhood information and ignore global interaction between the individual nodes of the graph.

## [Approach](#approach)

## [Results](#results)

## [Thoughts](#thoughts)
Application of GNNs for learning program semantics is pretty intuitive. Semantics are nicely represented by Abstract Syntax Tree, which are nothing but graphs in 

## [Interesting References for Better Understanding](#references)


