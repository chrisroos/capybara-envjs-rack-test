## Introduction

We came across a strange problem with [capybara-envjs](https://github.com/smparkes/capybara-envjs).  We were getting a `timer error` raised from within the [setTimeout definition](https://github.com/smparkes/env-js/blob/envjsrb/lib/envjs/event_loop.js#L67) in [envjs](https://github.com/smparkes/env-js) itself.

## The fix

I raised this as an [issue against envjs](https://github.com/smparkes/env-js/issues/issue/23) and Steven's now [fixed it](https://github.com/smparkes/env-js/commit/4307aa7b70af992f5e1d60fc736d0ba8c34649c6).  You'll currently need to apply the fix yourself by editing your local version of envjs.  Open the code with `bundle open envjs` and then edit the if condition starting on line 1447 of lib/envjs/env.js.  You'll need to add the following `else` statement (as per the commit above).

    else {
      prot = prot + '//';
    }

## Testing using capybara-envjs

I've created this simple(ish) app to demonstrate the problem with the help of capybara-envjs.  You should be able to see it for yourself by cloning this app and running `rake`.  Alternatively you can run the test from the command line with `ruby -I test -I lib test/envjs_rack_app_test.rb`.

You can also fix the problem by removing the comment in front of `return false` on line 18 of test.js.

## Testing using the johnson/spidermonkey version of envjs

    $ cd /path/to/this/repository
    $ rackup
    $ envjsrb
    js> window.location = 'http://localhost:9292/index.html'
     WARNIING:	[Fri Nov 05 2010 11:55:03 GMT+0000 (BST)] {ENVJS} could not load script http://localhost:9292/javascripts/jquery.min.js: LoadError
     WARNIING:	[Fri Nov 05 2010 11:55:03 GMT+0000 (BST)] {ENVJS} could not load script http://localhost:9292/javascripts/test.js: LoadError
    => "http://localhost:9292/index.html"
    # I don't know why but we have to load the page twice for it to load the external javascript files
    js> window.location = 'http://localhost:9292/index.html'
    => "http://localhost:9292/index.html"
    # 'Click' the link that makes the ajax request
    js> envjsTestLinkBehaviour(envjsJohnsonClickLink)
    linkHandler
    makeAjaxRequest
    timer error: undefined method `empty?' for nil:NilClass
    => nil
    # Show that the ajax request didn't update the document as expected
    js> $('#testResponseContainer').text()
    => "\n  \n\n"

## Testing using the rhino version of envjs

    $ git clone https://github.com/thatcher/env-js.git env-js-rhino
    $ cd env-js-rhino
    $ java -jar rhino/js.jar 
    Rhino 1.7 release 2 2009 03 22
    js> load('dist/env.rhino.js')
    [  Envjs/1.6 (Rhino; U; Mac OS X x86_64 10.6.4; en-US; rv:1.7.0.rc2) Resig/20070309 PilotFish/1.2.35  ]
    # So that we can load external scripts with a type of 'text/javascript'
    js> Envjs({scriptTypes: {"": true, "text/javascript": true}})
    js> window.location = 'http://localhost:9292/index.html'
    http://localhost:9292/index.html
    # 'Click' the link that makes the ajax request
    js> envjsTestLinkBehaviour(envjsRhinoClickLink)
    linkHandler
    makeAjaxRequest
    js> renderAjaxResponse
    # Show that the ajax request updated the document as expected
    js> $('#testResponseContainer').text()

  

    "Hello World"

## What were you trying to do?

We're trying to alter the behaviour of html links (anchors) such that the link makes an ajax request for the URL specified in the href attribute and we display the result in the page, rather than having the browser follow the URL.

We do this by:

* Changing the href of each anchor in the page so that it becomes a link to a fragment on the current page, e.g. `href="/foo/bar"` becomes `href="#/foo/bar"`.
* Adding an onclick event handler to each of these anchors that uses setTimeout to specify a function that should be called at some point in the future.  This might seem odd but we were using [jquery animate](http://api.jquery.com/animate/) (which uses setTimeout internally) to fade the content in/out of the page.
* Using jquery's $.get to request the URL specified in the href and write that into a specific container in the page once it's got the result.  (**NOTE** This demo doesn't currently parse the href - the URL is hardcoded in makeAjaxRequest()).
* We're explicitly *NOT* returning false from the onclick handler because we want the browser to 'follow' the URL so that we don't break standard browser behaviour.