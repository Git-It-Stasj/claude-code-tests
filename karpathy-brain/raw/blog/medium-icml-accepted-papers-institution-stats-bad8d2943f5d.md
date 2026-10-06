# ICML accepted papers institution stats

Date: Wed, 24 May 2017 19:09:35 GMT
URL: https://karpathy.medium.com/icml-accepted-papers-institution-stats-bad8d2943f5d

---

The accepted papers at ICML have been [published](https://2017.icml.cc/Conferences/2017/AcceptedPapersInitial). ICML is a top Machine Learning conference, and one of the most relevant to Deep Learning, although NIPS has a longer DL tradition and ICLR, being more focused, has a much higher DL density.

#### Most mentioned institutions

I thought it would be fun to compute some stats on institutions. Armed with Jupyter Notebook and regex, we look for all of the institution mentions, add up their counts and sort. Modulo a few annoyances:

- I manually collapse e.g. “Google”, “Google Inc.”, “Google Brain”, “Google Research” into one category, or “Stanford” and “Stanford University”.
- I only count up one unique mention of an institution on each paper, so if a paper has 20 people from a single institution this gets collapsed to a single mention. This way we get a better understanding of which institutions are involved on each paper in the conference.

In total we get 961 institution mentions, 420 unique. The top 30 are:

```
#mentions institution
---------------------
       44 Google
       33 Microsoft
       32 CMU
       25 DeepMind
       23 MIT
       22 Berkeley
       22 Stanford
       16 Cambridge
       16 Princeton
       15 None
       14 Georgia Tech
       13 Oxford
       11 UT Austin
       10 Duke
       10 Facebook
        9 ETH Zurich
        9 EPFL
        8 Columbia
        8 Harvard
        8 Michigan
        7 UCSD
        7 IBM
        7 New York
        7 Peking
        6 Cornell
        6 Washington
        6 Minnesota
        5 Virginia
        5 Weizmann Institute of Science
        5 Microsoft / Princeton / IAS
```

I’m not quite sure about “None” (15) in there. It’s listed as an institution on the ICML page and I can’t tell if they have a bug or if that’s a real cool new AI institution we don’t yet know about.

#### Industry vs. Academia

To get an idea of how much of the research is done at industry, I took the counts for the largest industry labs (DeepMind, Google, Microsoft, Facebook, IBM, Disney, Amazon, Adobe) and divide by the total. We get 14%, but this doesn’t capture the looong tail. Looking through the tail, I think it’s fair to say that

about 20–25% of papers have an industry involvement.

or rather, approximately three quarters of all papers at ICML have come entirely out of Academia. Also, since DeepMind/Google are both Alphabet, we can put them together (giving 60 total), and see that

6.3% of ICML papers have a Google/DeepMind author.

It would be fun to run this analysis over time. Back when I started my PhD (~2011), industry research was not as prevalent. It was common to see in Graphics (e.g. Adobe / Disney / etc), but not as much in AI / Machine Learning. A lot of that has changed and from purely subjective observation, the industry involvement has increased dramatically. However, Academia is still doing really well and contributes a large fraction (~75%) of the papers.

cool!

EDIT 1: fixed an error where previously the Alphabet stat above read 10% because I incorrectly added the numbers of DM and Google, instead of properly collapsing them to a single Alphabet entity.
EDIT 2: some more discussion and numbers on [r/ML](https://www.reddit.com/r/MachineLearning/comments/6d2zco/r_icml_2017_accepted_papers/) thread too.

[image: https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=bad8d2943f5d]
