---
layout: page
title: Hello! I'm Avinash Bhat.
---

<div class="intro-section">
  <div class="intro-text">
    <p>
    I am a PhD student in the <a href="https://www.cs.mcgill.ca/~jguo/lab.html">Software Technology Lab</a> at McGill University, advised by <a href="https://www.cs.mcgill.ca/~jguo">Professor Jin Guo</a>. My research is about understanding how software teams communicate, collaborate and share information as they develop and deploy software. My PhD research is centered around improving software documentation quality. 
    </p>

    <!-- <p>Previously I was a Software Engineer at Cisco Systems in Bangalore where I worked on enterprise tools for code reviewing and deployment. My Bachelors degree was in Computer Science and Engineering from <a href="https://nie.ac.in">the National Institute of Engineering, Mysore</a>. During my undergrad, I briefly worked for two <a href="http://hexoctane.com/">early</a> <a href="https://logichive.in/">stage</a> startups, explored collaborative filtering algorithms in recommender systems, and did my final year project on contextual information retrieval for Wikipedia articles.
    </p> -->

    <div class="content-tabs">
      <div class="tab-navigation">
        <button class="tab-button active" data-tab="news">News</button>
        <button class="tab-button" data-tab="publications">Publications</button>
        <!-- <button class="tab-button" data-tab="notes">Notes</button> -->
      </div>

      <div class="tab-content">
        <div id="news" class="tab-panel active">
          {% include news.html %}
        </div>

        <div id="publications" class="tab-panel">
          {% include publications.html %}
        </div>

        <div id="notes" class="tab-panel">
          {% include blogs.html %}
        </div>
      </div>
    </div>
  </div>

  <div class="profile-section">
    <div class="profile-image">
      <img alt="Profile Picture" src="{{site.baseurl}}/assets/images/avinashbhat_image_2.jpeg" />
    </div>
    <div class="profile-links">
      <a href="https://forms.gle/J1m4PnHjNArTdMLN6" target="_blank">Contact Me</a> |
      <a href="https://scholar.google.com/citations?user=QzcrX98AAAAJ&hl" target="_blank"><i class="fa-brands fa-google-scholar"></i></a> |
      <a href="https://www.linkedin.com/in/aviinashbhat/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a> |
      <a href="https://github.com/avinashbhat" target="_blank"><i class="fa-brands fa-github"></i></a> |
      <a href="https://twitter.com/aviinashbhat" target="_blank"><i class="fa-brands fa-x-twitter"></i></a> |
      <a href="https://hci.social/@avinash" target="_blank"><i class="fa-brands fa-mastodon"></i></a> |
      <a href="https://bsky.app/profile/aviinashbhat.bsky.social" target="_blank"><i class="fa-brands fa-bluesky"></i></a>
    </div>
  </div>
</div>
<br>
<div style="text-align: center; font-size: 75%;">
    &copy; {{ site.name }} {{ site.time | date: '%Y' }} | Avinash Bhat | All Rights Reserved.  
</div>

