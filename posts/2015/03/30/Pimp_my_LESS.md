Ever found yourself browsing  through some old legacy sources in some forsaken remote server with less?
well, here's a small tip you can use to make the experience not so bad. make less do more for you :)

first, make sure you have [pygments](http://pygments.org) installed:

```bash
user@pc:~$ sudo apt-get install python-pygments
```

then, just dump a small script somewhere on your path (I use _~/bin/lezz_):

```bash
#! /bin/sh
[ $# -ge 2 -a -f "$2" ] && input="$2" || input=""
pygmentize -l $1 -f terminal256 -O full,style=monokai $input | less -R
```

</div>
<img src="https://raw.githubusercontent.com/hochgi/blog/master/img/yodawg.jpg"/>
<div class="markdown" style="display: none;">

and that's it. now you can use it like:

&lt;pre&gt;
lezz [lang] [file]

# or recieve from stdin
cat [file] | lezz [lang]
&lt;/pre&gt;

e.g.

```bash
user@pc:~$ lezz bash `which lezz`
user@pc:~$ cat `which lezz` | lezz sh
```

##### P.S.
if you don't like the style, change it. instead of _monokai_ you can use any style under:

```bash
user@pc:~$ pygmentize -L style
```
