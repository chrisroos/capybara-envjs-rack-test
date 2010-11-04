## Introduction

We came across a strange problem with [capybara-envjs](https://github.com/smparkes/capybara-envjs).  We were getting a `timer error` raised from within the [setTimeout definition](https://github.com/smparkes/env-js/blob/envjsrb/lib/envjs/event_loop.js#L67) in [envjs](https://github.com/smparkes/env-js) itself.

I've created this simple(ish) app to demonstrate the problem.  You should be able to see it for yourself by cloning this app and running `rake`.

You can also fix the problem by removing the comment in front of `return false` on line 18 of test.js.

## What were you doing?

We're trying to alter the behaviour of html links (anchors) such that the link makes an ajax request for the URL specified in the href attribute and we display the result in the page, rather than having the browser follow the URL.

We do this by:

* Changing the href of each anchor in the page so that it becomes a link to a fragment on the current page, e.g. `href="/foo/bar"` becomes `href="#/foo/bar"`.
* Adding an onclick event handler to each of these anchors that uses setTimeout to specify a function that should be called at some point in the future.  This might seem odd but we were using [jquery animate](http://api.jquery.com/animate/) (which uses setTimeout internally) to fade the content in/out of the page.
* Using jquery's $.get to request the URL specified in the href and write that into a specific container in the page once it's got the result.  (**NOTE** This demo doesn't currently parse the href - the URL is hardcoded in makeAjaxRequest()).
* We're explicitly *NOT* returning false from the onclick handler because we want the browser to 'follow' the URL so that we don't break standard browser behaviour.

## The bit at the end

Although this works fine in Chrome, it fails with the `timer error` in envjs.  I'm not currently sure whether this is a problem in envjs (my gut says it is) but at least this should help identify whether it is or not.