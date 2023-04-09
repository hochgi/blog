## Every end is a new beginning
For the past 6 years I've been a part of the [CM-Well](https://github.com/thomsonreuters/CM-Well) development team. I'm writing this post with lot's of mixed feelings. Working on CM-Well has been an awesome experience! I got a chance to work with so many amazing people. But now it's time to move on, and I'm excited to start a new gig. 

## CM-Well - the early days
Last year we open-sourced CM-Well, and released the code on github. Doing so involved cleaning up the code, and getting rid off the commit history. Many team members who contributed a lot to the success of the project are not recognized. So, to get it out in the open, I opened the old repo, which has commits up until July last year, and I'm sharing some stats[^footnote1].

```sh
$ git shortlog -sn --all
  2697  Gilad Hoch
  1015  yaakov
   954  michael
   914  israel
   739  Israel
   720  Vadim.Punski
   580  Gilad.Hoch
   450  Mark Zitnik
   310  Tzofia Shiftan
   234  Matan Keidar
   222  Mark.Zitnik
   170  Eli
   125  Yaakov Breuer
   102  Michael.Irzh
    95  Michael
    94  Israel Klein
    87  Tzofia.Shiftan
    58  Eli Orzitzer
    54  Michael Irzh
    44  Builder
    42  gilad
    31  DockerBuilder
    22  dudi
    14  Dudi
    14  Dudi Landau
    14  Yoni.Mataraso
    10  matan
     9  tserver
     8  Liorw
     5  Liya.Katz
     4  israel klein
     2  Shachar.Ben-Zeev
     2  Yoni Mataraso
     2  builder
     1  James Howlett
     1  Yaakov
``` 

These are just the commits in the old repo, not including any new commits in github. I also created visualizations using [Gource](http://gource.io) for the old repo.

The first has files fading, and focuses on the contributors:

&lt;iframe style="display: block; margin: auto;" width="560" height="315" src="https://www.youtube.com/embed/qXBD3O9PvgI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen&gt;&lt;/iframe&gt;

The second version gives an overview of the entire project:

&lt;iframe style="display: block; margin: auto;" width="560" height="315" src="https://www.youtube.com/embed/zND6pyosMY4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen&gt;&lt;/iframe&gt;

The project is active, and has a lot of work invested in it, as you can see from the videos. But it doesn't quite show how CM-Well is used internally. So I fetched some random `access.log` file from one of the servers, and wrote a little something to convert the log into a [logstalgia](http://logstalgia.io) acceptable format:

https://github.com/hochgi/logstalgia-access-log-converter

I took this opportunity to get to know [mill](http://www.lihaoyi.com/mill) build tool, and some libraries I wanted to experiment with.
Long story short, I got 10 minutes of real CM-Well action on a single node (which is part of a cluster that has 20 web servers in it - so you're only getting 1/20th of the action), and made a visualization using _logstalgia_ with:

```sh
$ logstalgia -f -1280x720 --title "CM-Well access.log visualization"                \
    --screen 2 -p 0.2 -u 1 --background 75715e -x -g "meta,URI=/meta/.*$,10"        \
    -g "SPARQL,URI=/_sp?.*$,30" -g "_out,URI=/_out?.*$,10" -g "_in,URI=/_in?.*$,10" \
    -g "misc,URI=/.*,40" --paddle-mode single --paddle-position 0.75                \
    --disable-progress --font-size 25 --glow-duration 0.5 --glow-multiplier 2       \
    --glow-intensity 0.25 converted-access.log
```

And the output:

&lt;iframe style="display: block; margin: auto;" width="560" height="315" src="https://www.youtube.com/embed/vCy8QjjhojU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen&gt;&lt;/iframe&gt;

I gotta say, it came out pretty neat![^footnote2]

## Goodbye
I suck at goodbyes, so let me just say that I really loved working on CM-Well. It is a great project, and I hope to see it thrive. I will keep track of it, and plan to contribute occasionally on my spare time.  


[^footnote1]: In the early days, we used SVN, and we converted the repo to git at some point, which is why you see some duplicated names (that, and also we may have also committed from multiple users).

[^footnote2]: Kinda get me into thinking I should write a logstash appender that streams real-time action directly into a logstalgia end point. It's gotta be the coolest monitoring one can ask for...!
