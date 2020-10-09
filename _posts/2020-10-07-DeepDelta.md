---
layout: post
title: Can you repair compilation errors with deep learning?
description: Can you repair compilation errors with deep learning?
summary: Can you repair compilation errors with deep learning?
date: 2020-10-07T00:00:00.000Z
category: blog
comments: true
tags:
  - program-repair
  - deep-learning
  - research-watch
  - software-engineering
  - neural-machine-translation
published: false
---

> Mesbah, Ali, Andrew Rice, Emily Johnston, Nick Glorioso, and Edward Aftandilian. 2019. “DeepDelta: Learning to Repair Compilation Errors.” In ESEC/FSE 2019 - Proceedings of the 2019 27th ACM Joint Meeting European Software Engineering Conference and Symposium on the Foundations of Software Engineering, 925–36. Association for Computing Machinery, Inc. doi:10.1145/3338906.3340455.

<br>

As developers, we all spend hours in debugging the code, so that it compiles fine. While the days of breaking our heads to find the bugs are far from over, the **DeepDelta framework** offers insight into an innovative approach to generate code repair changes automatically.
<br><br>
<div style="text-align:center;">
<iframe alt="A cat beating the keyboard repeatedly and fast." src="https://giphy.com/embed/LmNwrBhejkK9EFP504" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>
<div style="width:484px height:319px; font-size:80%; text-align:center;">
	<a href="https://giphy.com/gifs/memecandy-LmNwrBhejkK9EFP504">Build issues!</a>
</div>
<br>

## Abstract
While writing code is a highly logical activity, much of the process is iterative in itself. So it makes sense that any sort of error that creeps in while compilation can be fixed with following some pattern in code. DeepDelta exploits this attibute of software development, and leverage deep neural networks to predict program repairs. While compiling a program, the compiler usually spits out a diagnostic information. The error diagnostic becomes the ```X``` or *source*.
<br><br>
<div style="text-align:center;">
<img alt="Maven Error Log" src="{{site.baseurl}}/assets/images/2020-10-07-01.png"/>
</div>
<div style="width:484px height:319px; font-size:80%; text-align:center;">
	Maven error looks like this. Different build tools give different diagnostics.
</div>
<br>

There is a change delta, which is nothing but the code change (or diff, when you speak in terms of Git) done to successfully compile the code. An Abstract Syntax Tree representation of this diff forms the target or ```Y```. The researchers run this input data through a NMT network and train a model that gives out a success rate of 50%. There are multiple ways to fix the code too. Out of the 50% success scenarios, the predicted changes are about 86% of the time in the top three ways to fix the code, indicating the relevancy of the model output.

## Introduction and Background


## Data Collection and Insights

## Evaluation and Results

## Discussions and Future Work

## Related Papers

## Thoughts
