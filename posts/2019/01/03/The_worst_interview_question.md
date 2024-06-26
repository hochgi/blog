## tl;dr
We, the software development industry people, seek new job opportunities every now and then. Those of us who are in the game long enough, have seen all kinds of interviews. Maybe even conducted interviews for others. As someone who has been on both sides of the fence, I'd like to share some insights, mostly aimed for those conducting the interview, and I'll do it by sharing a real example.

## Assume nothing
Every interview conductor has been interviewed by someone else at some point. This is how we get in. It seems like some people tend to forget how it looks from the other end of the table. When asking technical or theoretical questions, one should be very clear, and verify the person standing in front of him understood the question. More often than not, we assume people understand what we meant for them to understand, only to find out later it wasn't the case. We also tend to assume people think similarly to us about the problems we present to them. Obviously, those assumptions are wrong.


## The trick is to not use any tricks
When we ask a question, it should be clear to us what information can we infer on the candidate standing before us from the way he answers. Some questions has no value at all. Usually, "trick questions", for example, has no value. Either the candidate knows the question, and the trick to solve it, or they don't. Asking such question yields nothing meaningful if the candidate knows the answer by heart. And have little value if they don't (you do get to see how they think, and how they approach the problem). Thing is, it hurts the candidate confidence if you present a question they fail to answer, and it will affect them for the rest of the interview. Some trick answers, are not even the (most) correct answers to the question. A (very) good candidate might know better, and a fixed minded interviewer, who has his mind set on the trick answer, might not understand it.


## The worst interview question
I was once asked to solve such trick question. I also knew the trick and that it wasn't the best approach. The question was (essentially[^footnote1]):
> given a shuffled sequence of \(n - 1\) numbers, all distinct and part of an arithmetic sequence range of \(n\) numbers, find the missing number in the sequence.

There are many ways to answer that question. I will present 4 solutions in rising complexity order, but eventually, you will see that the simple solutions have gentle flaws, and best (IMO) answer, is actually the most complicated one. Moreover, I feel it's also important to note (though not the main goal of the post) that abstracting the question too much, like what was done here, only increases the gap between the understanding of the interviewer (and what he meant), and the understanding of the candidate[^footnote2]. Anyway, we are aiming for linear (time) complexity answer[^footnote3].


## 1st Answer (the trick)
We are talking about an arithmetic sequence, so let's use [the formula](https://en.wikipedia.org/wiki/Arithmetic_progression#Sum): we can scan the sequence, and find \(min\), \(max\), & \(sum\) of given numbers, and compute the difference:
$$result=\frac{n(min + max)}{2}-sum$$
Simple. Elegant. And flawed to the core!
So what's wrong with it? Well... The implicit assumption here, is that adding 2 numbers is done at constant time. Isn't it? NO! it's only constant if you use primitives such as 32 bit int, or 64 bit long, etc'... But we have no restrictions on the length of the given sequence. If we use primitives, we risk arithmetic overflow, and get a wrong answer. So we need to use something like `BigInteger`, which has addition operation in linear complexity with the numbers of digits (bits) of the number. I.e: [logarithmic in terms of \(n\)](https://en.m.wikipedia.org/wiki/Computational_complexity_of_mathematical_operations#Arithmetic_functions). So either it's wrong, or we ended up with implicitly \(n\log(n)\) complexity.


## 2nd Answer
OK, let's try again. we have an arithmetic sequence, so it means we have a bijective function[^footnote4] \(f\) into \(\mathbb{N}\)[^footnote5]. This means we also have the reversed function \(f^{-1}\). We can initialize a boolean array `a` with size of \(n\) and `false` values in all cells. On the next step, we iterate over the original sequence, and for every number \(k\) we encounter, we compute the index \(i=f\big(k\big)\), and set `a[i]=true`. Once we are done, the boolean array will be filled with `true` values in all cells, besides in the cell corresponding to the missing number. We can easily iterate over that array, and find that index `j`, and compute the result with \(f^{-1}\big(j\big)\).
Is this better? well... not so much... we basically traded our \(O\big(n\log(n)\big)\) time complexity and \(O\big(1\big)\) space complexity with linear time & space complexity. This feels like cheating. Trading time complexity with space complexity isn't really improving. And we can easily think of scenarios where we don't have the luxury of allocating so much memory.


## 3rd Answer
From now on I'm going to explain the solutions in terms of numbers in the range \(\big[1,n\big]\) instead of speaking about our bijective function \(f\) and it's reversal \(f^{-1}\), for simplicity.
Trying again, we can come up with a slightly more complex solution, but more "memory friendly" (pseudo code):
```pseudo-code
i,j ← 0
while(i < n - 1) {
  j ← a[i]
  while(j > i) {
    swap(a[i],a[j])
    j ← a[i]
    if(j == n) {
      return i
    }
  }
  i++
}
return n - 1
```
So what's going on here? we scan the sequence `a`, and as long as `a[i]==i` we do nothing. When it's not equal, it means it is larger[^footnote6]. In this case, we look at the cycle `a[i] → a[a[i]] → … → i`, and swap elements as we go until we finished the cycle, and all the elements we've seen, are now properly placed in their corresponding indices. There is one special "cycle" though. The "cycle" (list actually) containing \(n\) itself. This list will start with the missing element's index, and will end when we reach the cell containing \(n\). Why? I'll leave it as an exercise for you to figure out. you can check out the [hint](https://en.wikipedia.org/wiki/Pigeonhole_principle) if you want[^footnote7].
So, is this better? well yes. but still not perfect. we still used an assumption implicitly, without realizing the question does not allow it. I'm talking about RAM. The ability to hop between indices back and fourth in \(O\big(1\big)\) time is not explicitly given, and we cannot assume it. In case we do have RAM access, we use \(O\big(n\big)\) time & \(O\big(1\big)\) space. So we're half way there. But since in our world, we may talk about a linked model only (think about distributed graphs, scattered files on some cloud, etc'...), we can try to do better.

## 4th Answer
In this last answer, I'm gonna count on the reader having some basic CS 101 knowledge (don't worry too much if you don't, I'll link to resources where necessary), and will only describe the idea in higher level, since it's gonna be too terse to delve into all the lower level details.
Take a moment to refresh your memory on [quicksort](https://en.wikipedia.org/wiki/Quicksort) algorithm. We'll tear it apart, and use the building blocks to solve our problem.
Wikipedia's high level description of the algorithm is as follows:

> 1. Pick an element, called a pivot, from the array.
> 2. Partitioning: reorder the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it (equal values can go either way). After this partitioning, the pivot is in its final position. This is called the partition operation.
> 3. Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.

Wikipedia is speaking in terms of "array", but quicksort also works perfectly well on linked lists. What we will do, is similar:

> 1. Pick a **GOOD** pivot
> 2. Use partition
> 3. After partition, check if `index(pivot) == pivot` or `index(pivot) == pivot - 1` [^footnote8]
> a. If equal recurse only on `> pivot` part of the sequence
> b. If pivot is larger (by 1) than it's index, recurse only on `< pivot` part of the sequence
> 4. When sequence is small enough (e.g. < 5), sort it, and check sorted sub-sequence together with next index's element (if exist, could be a pivot from previous iteration). the gap will be there.

What are we aiming at here? well, before we go into complexity analysis, we need to explain why it works. It's not a formal proof, but good enough. We know we have all the numbers except one in the range \(\big[1,n\big]\). And we know the indices are \(\big[1, …, n-1\big]\). So if we would've sorted the sequence, all the elements before the gap would've been found at the correct index (`a[i] == i`), and all the elements larger than the missing element would've been at an offset of one from their index (`a[i - 1] == i`). So if we place the pivot at exactly the correct index, we can tell by looking at the offset if we are higher or lower than the missing element. So we do something very similar to [quickselect](https://en.wikipedia.org/wiki/Quickselect), only instead of knowing up front the index \(k\) we want, we iterate according to the index offset. When we finish, the gap might be at a neighboring cell (if missing element index was chosen as pivot at a previous round of the iteration), and we check \(O\big(1\big)\) sorted elements containing the gap for the missing element.
I claim that if we choose a good pivot, this process will take linear time. But before I explain why, I'll give you a minute to see that [good pivots can be chosen in linear time](https://en.wikipedia.org/wiki/Median_of_medians). The tl;dr of it, is that we can choose a pivot that will be in the range \(\big[0.3n,0.7n\big]\), so we avoid the worst case leading to \(O\big(n^2\big)\) running time. in the worst case, we are always left with 70% of our sequence to check. Each iteration is \(O\big(n'\big)\) where \(n'\) is the size of the subsequence we iterate on. This is because choosing a good pivot takes \(O\big(n'\big)\) and partition takes another \(O\big(n'\big)\). in total, we'll get
$$\sum_{i=0}^{log_{10/7}{n}}{2{\Big(\frac{7}{10}\Big)}^{i}}n=2n\sum_{i=0}^{log_{10/7}{n}}{{\Big(\frac{7}{10}\Big)}^{i}}\lt2n\sum_{i=0}^{\infty}{{\Big(\frac{7}{10}\Big)}^{i}}=2n\cdot{3\frac{1}{3}}=O\big(n\big)$$

There is so much I'm not explaining here, and many short cuts taken (especially in the math). Like, why (and how) does it work on linked lists, why it's OK to compare numbers and assume it's \(O\big(1\big)\), but not ok to assume this for addition (actually, it's not. but in the first solution we summed up \(n\) elements, meaning \(n^2\) must be less than our primitive max value. when we compare primitives without summing, we can use the entire primitives range \[think of unsigned 64 bit long...\], which is still better than using \(\sqrt{primitive\ max\ value}\)), etc'...
But I want to cut to the point.

## The point
This is a very bad question to ask in job interviews. But what I wish for you to take from this, is not the fact that some questions are more suited than others for job interviews (well, that too). It is the fact that in most cases there is a huge gap between the candidate and the interviewer. I'm not talking about intelligence here. I'm talking about the fact that any question can be misunderstood very easily, as any answer can be misunderstood very easily as well[^footnote9]. So neither the interviewer, nor the candidate should be taken lightly. We tend to disrespect who we don't understand too easy. Try to overcome the urge, and try to put yourselves in the other side of the table. Of course this is aimed more for the interviewer, than the candidate. And keep in mind, you as the interviewer, want to hire the best and smartest person for the job. So don't be hasty and give up one someone who might be that perfect candidate. Force yourself to understand. And remember, in our industry, it's very possible you'll find yourself in the candidate shoes in the future.

[^footnote1]: they did not actually use the term "arithmetic sequence" since that would give hint to the trick they were after. Instead, they gave a vague definition of numbers spaced evenly between two arbitrarily large numbers \(m\) & \(M\)

[^footnote2]: candidate might understand exactly what he's being asked. In this example, and since the interviewer was obviously after the trick answer, he could've present the question as numbers in the range \(\big[1,n\big]\), instead vaguely defining an arithmetic sequence without naming it

[^footnote3]: because sorting in \(O\big(n\log{n}\big)\) and scanning for the gap is trivial, and we can obviously do better

[^footnote4]: meaning one‑to‑one correspondence

[^footnote5]: \(\mathbb{N}\) stands for the naturals numbers

[^footnote6]: Why? well... let's leave it as an exercise for the reader ;)

[^footnote7]: This is not easy or trivial (even with the hint), and the only reason I'm leaving it out and not explaining in full, is because it's not this post's goal, and it is getting lengthier than I thought already.

[^footnote8]: That's the only 2 possible options.

[^footnote9]: And as you probably understand, this is exactly what happened to me on that occasion. I should've taken the understanding gap into consideration.
