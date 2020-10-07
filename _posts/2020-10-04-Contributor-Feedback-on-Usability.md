---
layout: post
title: Contributor Feedback on Usability in Open Source Software
description: Contributor Feedback on Usability in Open Source Software
summary: Contributor Feedback on Usability in Open Source Software
date: 2020-10-04T00:00:00.000Z
category: blog
comments: true
tags:
  - machine-learning
  - research-watch
  - software-engineering
  - survey
published: true
---

> Wang, Wenting, Jinghui Cheng, and Jin L.C. Guo. 2020. “How Do Open Source Software Contributors Perceive and Address Usability? Valued Factors, Practices, and Challenges.” IEEE Software. IEEE Computer Society. doi:10.1109/MS.2020.3009514.

<br>

According to Wikipedia, usability is the degree to which a software can be used by specified consumers to achieve quantified objectives with effectiveness, efficiency, and satisfaction in a quantified context of use. For a Open Source Software, this becomes a community opinion. Since the advent of collaborative tools like GitHub which help the software development progress at a faster pace, usability of the developed tools becomes a cause of concern. This paper presents a community view by analyzing 84 survey responses.


## Abstract
The major pattern observed in the survey is that developers often adopt software-centric approach to design the product (focus on the software stack, ease of development) rather than user-centric approach. While they recognize the importance of usability, most of the developers find it difficult to consolidate and understand the community needs.


## Introduction and Background
Open Source Software development has challenges like geographically distributed communities, diverse contributor background, absense of hierarchy in members and possible asynchronous communication. This can lead to the development process becoming localised, while the software can be used globally. 

While usability is considered important, it was only treated as a *feature* of the software rather than making it the center around which the software is built. However, considering the tremendous growth of the open source world, it becomes cardinal to understand the community standpoint on the issue.

The key questions answered in the survey, paraphrasing from the paper, are

**How do OSS contributors perceive the determining factors associated with usability?** 

**What are the prominent approaches OSS contributors currently carry out to address usability issues?**

**What are the prominent barriers and difficulties they faced with respect to addressing usability?**


## Survey Methods

<div style="text-align:center;">
<img alt="Survey Instrument" src="{{site.baseurl}}/assets/images/2020-10-04-01.png"/>
</div>
<div style="width:484px height:319px; font-size:80%; text-align:center;">
	<a href="https://zenodo.org/record/3937877#.X3qU-5P7RhE">Survey Instrument</a>
</div>
<br>

The survey demographics was varied between software engineers, managers, designers, software architects, data scientists and others. Their contributions were wide ranging, from feature development and code maintainance to UI design, public relation and release management.

However, researchers mention that that the demographics was only that of GitHub users. This can possibly skew the data, as any activity on this platform will be affected by the features of the platform itself. However, it goes without saying that any prominent issue that is captured on this platform can represent a non trivial subset, if not most of the issues about OSS usability.


## Survey Results
Results from the survey are divided into three categories - **Valued Factors**, **Practises** and **Challenges**. 
### Valued Factors
Researchers identified six themes that are valued by the software practitioners. These are listed down in the decreasing order of the popularity.
1. **Usability related System Characteristics** Participants value efficiency, consistency and customizability. The researchers mention that people involved in the development seemed to have followed the usability guidelines for achieving these system centric qualities. This is quite possible since these qualities would be paramount to the adoption of software.

2. **Other System Characteristics** System characteristics such as reliability, maintainability and feature completeness conrtibute to usability as well. Code quality affects usability to some extent, as it becomes easier to iterate over the software and make it better.

3. **User Support** The interaction of development team with the users of the software; to respond to the issues, and feature development on request. This improves the trust among users in the software, that their concerns are heard and addressed.

4. **Environment and Market** Audience size, competitor performance and software impact over users and society. Higher the popularity of the software, more users use it resulting in more bugs or feature requests to handle varied scenarios. Competitor performance and impact ensures that there will be a higher effort in the development process and more iterations. These further improve the usability.

5. **User Characteristics** Understanding the background of the target users can aid the usability design as it will make sure that the contributors plan the way the software is to be used - either focussing on the power users or make the software diverse.
6. **Resource and Mindset** Financial support, time, and expertise of the members involved contribute to the usability of the OSS as well.

### Practises
Researchers identify the methodology followed by the practitioners in their usability design for the OSS.
1. **Explore Needs** Participants welcome the feedback on usability. They three types of people who provide these are the general users (who provide the feedback in ITSs), power users involved in the the development process and developers themselves by discussing with the users. Sometimes the usability features are also inspired from research literature, competitor systems and opinions by consultants.

2. **Approach Design** There are three approaches that are used by the participants. <br>
 *An interactive trial and error process* was followed by majority of participants where a feature is developed, then the feedback for the usability is captured using ITSs and further itrations to the software is made based on the requirement. <br>
 *A participatory approach* where the users are directly involved in the development.<br>
 *Designing a system based on their own opinions*, which are influenced from guidelines or tutorials.

3. **Evaluator Usability** The usability evaluation is done mainly through ITSs, if done at all. One more approach that is followed is an informal approach where is the testing is done by some personal connections, power users or anyone who is closely associated with the software and not the end users. Sometimes, the usability is evaulated by UX students, and has resulted in success. Apart from these, the usability can be evaluated by the internal evaulation of development team (more like developer testing) which follows the line of thinking that developers are also users.

### Challenges

Challenges faced by the participants towards usability of the OSS is as follows.
1. **Mindset** The developers tend to be system-centered while designing a system and focus on improving the feature set and performance and neglect usability. This can be tackled by having a user feedback phase in the development cycle, and thereby nudging the developers towards paying attention to usability.

2. **Understanding User Needs** User needs evolve frequently, and are also difficult to map the feedback to development tasks. This can be improved by having better discussions with the users; many times, a complicated feature can be avoided by just making minor changes to the existing code to address the underlying issue. Better software to gather feedback data also would help in addressing the issue.

3. **Addressing User Diversity** Since OSSs have a diverse user base, the feature requests need to prioritized. Addressing usability for a large user base is hard; some power users might need customizable features, but some users might feel this can add unnecessary complexity to their workflow. Finding a balance between these two can enable easier and better adoption.

4. **Development Issues** Framework, library limitations, project complexity and lack of transparency in development process can affect usability as well. Over the course of years, new developers can come in and some may move out of the project, resulting in different standpoints and ways of approaching usability. This can be addressed by the better onboarding practices for developers.

<br>
<div style="text-align:center;">
<img alt="Summary of the survey results" src="{{site.baseurl}}/assets/images/2020-10-04-02.png"/>
</div>
<div style="width:484px height:319px; font-size:80%; text-align:center;">
	Summary of the survey results
</div>
<br>

## Limitations and Future Work

## References for better conceptual understanding
 1.

## Thoughts
This survey acutely captures the thoughts of the developers regarding usability while developing a software. Any software should be designed around usability. Easier and intuitive a software is to use, easier it is to improve the adoption. The researchers offer valuable suggestions improve the mindset in developers.

I believe that this paper is relevant to developers, to inculcate a usability-centric mindset.

The results can also be pivoted in such a way, to understand how the valued factors, practises and challenges influence one another. FOr example, 