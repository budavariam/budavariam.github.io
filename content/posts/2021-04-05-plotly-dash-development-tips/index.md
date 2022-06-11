---
layout: post
title: Plotly Dash Development Tips
tags: [plotly, dash, python, javascript, react, dataviz]
cover:
  alt: Cover photo from https://plotly.com/dash/
  hidden: false
resources:
  - name: cover
    src: cover.png
date: 2021-04-05
featured:
  - "home"
draft: false
---

Last year I was working on some dash-plotly applications/dashboards.
It was confusing at first, I learned a lot during that time, I'd like to share my gathered experience.
The docs already contain useful information, I do not wish to repeat them.
There are many example pages in github, my goal is to collect my most visited pages here,
so it'll be easier to start out with development.

<!--more-->

## Useful links for getting started

- [dash.plotly.com/layout](https://dash.plotly.com/layout) dash tutorials and concepts, great starting point
  - [dash.plotly.com/basic-callbacks](https://dash.plotly.com/basic-callbacks) Info on callbacks
  - [dash.plotly.com/callback-gotchas](https://dash.plotly.com/callback-gotchas). Note the rules of callbacks. They're important, so I copy them here:
    - Callbacks require their Inputs, States, and Output to be present in the layout
    - Callbacks require `all` Inputs and States to be rendered on the page
    - A component/property pair can only be the Output of `one` callback
    - `All` callbacks must be defined before the server starts
    - All Dash Core Components in a layout should be registered with a callback.
      - legacy rule
    - Callback Definitions Don't Need To Be In Lists
      - I prefer lists, since it's easy to forget to add it to all return values when switching around
- [plotly.com/python](https://plotly.com/python/) a lot of plotly examples
- [plotly.com/python/reference](https://plotly.com/python/reference/) very useful reference docs on the available properties
- [github.com/plotly/plotly.js](https://github.com/plotly/plotly.js/*) plotly.js git repo: issues and source code are gold
- [github.com/plotly/dash-recipes](https://github.com/plotly/dash-recipes) recipes for advanced usecases
- [github.com/ucg8j/awesome-dash](https://github.com/ucg8j/awesome-dash) curated list of further reading material, libs, talks and more
- tutorial to clear up confusion about [customdata hovertemplate](https://chart-studio.plotly.com/~empet/15366/customdata-for-a-few-plotly-chart-types/#/)
- optional:
  - [dash-bootstrap-components](https://dash-bootstrap-components.opensource.faculty.ai/) 3rd party responsive components
  - [pandas cheatsheet](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf)

<!-- ## Enterprise dash links

- [https://COMPANYURL/Docs/dash-design-kit](https://COMPANYURL/Docs/dash-design-kit) dash design kit docs
- [https://COMPANYURL/Docs](https://COMPANYURL/Docs) dash enterprise docs
- [https://COMPANYURL/Docs/packages](https://COMPANYURL/Docs/packages) current package versions -->

## Dash clientside callbacks

[https://dash.plotly.com/clientside-callbacks](https://dash.plotly.com/clientside-callbacks)

> Note: All examples use a single output, but we can pass an array as return value

Some examples can be found [here (test_clientside.py)](https://github.com/plotly/dash/blob/dev/tests/integration/clientside/test_clientside.py)

- If you do not want to update a value return **window.dash_clientside.no_update**
- If you do not want to update _at all_ in that callback `throw` **window.dash_clientside.PreventUpdate** as an exception

### Access plotly events in dash

> Note: the events can only be accessed from clientside.

[This](https://plotly.com/javascript/plotlyjs-events/) document shows what you can do with plotly events.

If you define a callback that is called _after_ the figure has been created/updated, you can subscribe to the plot events

```jsx
// works if the plot's id is main-plot
let plotlyGraph = document.querySelector("#main-plot .js-plotly-plot");
plotlyGraph.on("plotly_animatingframe", (anim) =>
  console.log(
    "Frame: %s, frameData: %o, animationSettings: %o",
    anim.name,
    anim.frame,
    anim.animation
  )
);
```

> Note: if you register an eventlistener multiple times it will call its callback multiple times (as you told them to)

> Note: you can only subscribe to events if the plot has appeared in the DOM

### Unsubscribe from events

Plotly.js uses a NodeJS style EventEmitter API

[Source code](https://github.com/plotly/plotly.js/blob/bae378a79bfce17463aed0f70402e4b9cf50ca3c/src/lib/events.js#L56-L57)

```jsx
graphDiv.removeListener("plotly_click", handler);
graphDiv.removeAllListeners("plotly_click");
```

### All possible events

Here's the list of all available events extracted from the source code:

```js
"plotly_afterexport";
"plotly_afterplot";
"plotly_animated";
"plotly_animating";
"plotly_animatingframe";
"plotly_animationinterrupted";
"plotly_autosize";
"plotly_beforeexport";
"plotly_buttonclicked";
"plotly_click";
"plotly_clickannotation";
"plotly_deselect";
"plotly_doubleclick";
"plotly_framework";
"plotly_hover";
"plotly_react";
"plotly_redraw";
"plotly_relayout";
"plotly_relayouting";
"plotly_restyle";
"plotly_selected";
"plotly_selecting";
"plotly_sliderchange";
"plotly_sliderend";
"plotly_sliderstart";
"plotly_transitioned";
"plotly_transitioning";
"plotly_transitioninterrupted";
"plotly_unhover";
"plotly_update";
"plotly_webglcontextlost";

```

#### My extraction method

I cloned the plotly.js [git repo](https://github.com/plotly/plotly.js/).
Then run a search for all unique occurances of the plotly events that were sent with `emit` by using [ag, the silver seracher](https://github.com/ggreer/the_silver_searcher).

```bash
git clone git@github.com:plotly/plotly.js.git
cd plotly.js
ag --noheading --nogroup -o --nonumbers --nofile "gd.emit\('plotly_[^']+'" | sort -u
```

## Dynamic update

Docs: [live-updates](https://dash.plotly.com/live-updates)

In dash in order to change the value of a prop in a callback, you can only respond to other callbacks, and only with one value for one callback. If you periodically need to update a value, you need to have something, that continuously triggers an event (change a prop, that is used as callback input), that you can respond to.

You can use a ticker to call a callback periodically, you can use it's value both in clientside and serverside callbacks

```jsx
import dash_core_components as dcc
dcc.Interval(id='my-interval', interval=100)

app.clientside_callback(
    ClientsideFunction('clientside', 'my-updater-function'),
    [Output("change", "change-this-prop")],
    [Input("my-interval", "n_intervals")]
)
```

Reference: [https://dash.plotly.com/dash-core-components/interval](https://dash.plotly.com/dash-core-components/interval)

> Note: If you set the attributes of a DOM item from arbitrary js code, e.g. event handlers, it won't trigger a callback.

You can only respond to callback with one value, here's where this component shines, it lets you periodically call a callback, and set any other value.

### Downside of interval

The ticker will communicate with the server in the given interval, if you need a fast dashboard this might not be the best idea, to sync the state with the dash server. It will most likely degrade performance with more and more users.

If you have the option to pass down all the necessary data, with clientside callbacks and global variables in javascript code, you can create lightning fast dashboards.

## Animations

Docs: [animations](https://plotly.com/python/animations/)

```jsx
const plotlyGraph = document.querySelector("#main-plot .js-plotly-plot");
plotlyGraph.on("plotly_animated", (a) =>
  console.log("animation has finished plotly_animated event", a)
);
plotlyGraph.on("plotly_animating", (a) =>
  console.log("animation has started plotly_animating event", a)
);
plotlyGraph.on("plotly_animatingframe", (a) =>
  console.log("call on each frame plotly_animatingframe event", a)
);
plotlyGraph.on("plotly_animationinterrupted", (a) =>
  console.log("pause btn clicked plotly_animationinterrupted event", a)
);
```

{{< adarticle >}}

## State vs Input

Docs: [forum post](https://community.plotly.com/t/what-is-the-difference-between-input-and-state/35219)

The `@app.callback` decorator can have 3 parameters, Inputs, Outputs, and States.
Input triggers a refresh on change, State does not, only use the latest version of the value, that is available when the callback runs.

When you load the page for the first time, all callbacks will be called with the initial value.
If you calculate default values in the beginning, and you want to use them in an other callback, then if you add them as an `Input`, it will wait for that data, BUT if you add it as a `State` it won't wait for it, it will use the data that has been calculated until that point that your callback has been called.

```py
@app.callback(
    output=[
        # the result of the callback will set the given prop on the given element 
        Output('my-link', 'href'),
    ],
    inputs=[
        # if it changes it triggers a callback call
        Input('url', 'search'), 
    ],
    state=[
        # if it changes it does not trigger a callback call
        # but the value is available as a prameter
        State('strava-auth', 'data'),
    ]
)
def login_verdict(url, auth_data):
  print(url, auth_data)
  return ["https://dash.plotly.com"]
```

## Prevent update of outputs

In case you do not need to refresh all values in a callback, you can tell plotly that it should keep the previous value, and thus it will not trigger other callback that depend on that value.

Otherwise if you'd set the same value as before, then dash would think, that a new value have arrived, and calls the next callbacks in the chain.

There are 2 types of preventions:

- prevent any kind of update in the callback. It is called `PreventUpdate`, it should be `raised` as an exception
- do not update a single value it is called `no_update`, it should be `returned` as a value

### Clientside callback

In javascript:

- `return window.dash_clientside.no_update`
- `throw window.dash_clientside.PreventUpdate`

### Serverside callbacks

In python:

```py
from dash.exceptions import PreventUpdate
import dash

@app.callback(...)
def callback_prevent_all():
    raise PreventUpdate

@app.callback(...)
def callback_prevent_some():
    return [any_value, dash.no_update, any_other_value]
```

## Store simple runtime data

We should not use global variables in plotly python code, since it will be changed for all users.

We can use global variables in javascript, since it will be only used for that client, but only for that one browser tab.

In case we want to share arbitrary data between the clientside and serverside, we can create a hidden div, and set it's [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). It can be accessed in Input, Output and State of callbacks.

Reference [https://dash.plotly.com/dash-html-components/div](https://dash.plotly.com/dash-html-components/div)

> data-\* (string; optional): A wildcard data attribute

```jsx
import dash_html_components as html
html.Div(id="hidden-data-value", style=dict(display="none"), **{
  "data-value-1": "hello",
  "data-value-2": "false"
}),
```

> Note: the values stored in data-attributes are strings.

One simple usecase is if you have a quickly changing data, you can store it in JS global variable, and have a clientside callback that stores it in a `data` prop of a div every 100ms, and then you can react to its changes in these fixed sampled times even from python code.

### dcc.Store

Docs: [Store](https://dash.plotly.com/dash-core-components/store)

A better way to handle shared data is `dash_core_components.Store`.

It can store data in:

- memory `storage_type='memory'` (default)
- localstorage `storage_type='local'`
- sessionstorage `storage_type='session'`

Empty value is `None`, I prefer to store `dict` in this type, can not store list since it is not JSON enumerable, but it can be embedded in a dict.

## Handle URL

Some basic examples, and concepts: [urls](https://dash.plotly.com/urls)

Reference for [Location element](https://dash.plotly.com/dash-core-components/location)

## Callback context

Docs: [Callback context](https://dash.plotly.com/advanced-callbacks#determining-which-input-has-fired-with-dash.callback_context)

If an input triggers a callback to run, by default you won't have an idea of which component triggered it.
Luckily now callback contexts are available, and you can split your logic across that information as well.

```py
# inside a callback
ctx = dash.callback_context
if not ctx.triggered:
    trigger_id = '-'
else:
    trigger_id = ctx.triggered[0]['prop_id'].split('.')[0]
ctx_msg = json.dumps({
    'states': ctx.states,
    'triggered': ctx.triggered,
    'inputs': ctx.inputs
}, indent=2)
```

{{< adarticle >}}

## Custom components

If you need custom behavior and you're not afraid of react, I strongly advise you to create custom components.
Basically write only React.js code.

Defined props can be updated with the usual callbacks, it can tell dash,
that it's input data has changed, and trigger other callbacks that depend on that data.

### Benefits

I think in general it's a good idea to keep the callback graph clean and small, custom components can dramatically decrease graph size.

It will be easier to comprehend the application flow and you can encapsulate complex logic.

It will speed up development, people can develop the custom components separately, and test them in a sandbox environment.

### Downside

The downside of custom components is that you need to define the components' DOM structure yourself, style them consistently,
even if there's an existing dash component that does the exact same thing that you'd need.

It's tricky to keep it consistent with the development environment, if you use bootstrap or enterprise dash-design-kit.

### Getting started

- [Getting started](https://dash.plotly.com/plugins)
- Create custom component boilerplate:

  ```bash
  pip install cookiecutter && cookiecutter https://github.com/plotly/dash-component-boilerplate.git
  ```

### Loading state

Docs: [loading](https://dash.plotly.com/dash-core-components/loading)

Dash renderer lets your custom component know if it is in a loading state, you can get that info with these properties.

```jsx
/**
 * Object that holds the loading state object coming from dash-renderer
 */
loading_state: PropTypes.shape({
    /**
     * Determines if the component is loading or not
     */
    is_loading: PropTypes.bool,
    /**
     * Holds which property is loading
     */
    prop_name: PropTypes.string,
    /**
     * Holds the name of the component that is loading
     */
    component_name: PropTypes.string,
}),
```

### How to use loading component

If you wrap your component(s) inside `dash_core_components.Loading`, then there will be a common loading indicator around them if any children is waiting for a callback response.

```py
from dash_core_components import Loading
layout = Loading(children=[MyComponent(id="my-comp")])
```

### Update callback

In case your custom component makes changes that should trigger a dash callback, you can use `setProps` callback with the updated props.

```jsx
/**
 * Dash-assigned callback that should be called to report property changes
 * to Dash, to make them available for callbacks.
 */
setProps: PropTypes.func;
```

For example:

```jsx
<input
  value={myProperty}
  onChange={
    /*
     * Send the new value to the parent component.
     * setProps is a prop that is automatically supplied
     * by dash's front-end ("dash-renderer").
     * In a Dash app, this will update the component's
     * props and send the data back to the Python Dash
     * app server if a callback uses the modified prop as
     * Input or State.
     */
    (e) => setProps({ myProperty: e.target.value })
  }
/>
```

> Note: In dash callbacks you can not use a prop in two callbacks as an `Output`, but this is somewhat an exception.
> You can update any input parameters of your component, even if other components use it as an `Output`.

## Build & deploy

Run `python setup.py sdist` to build the app into a bundle, you can add the dist into `requirements.txt` even as a `tar.gz` file.
But it's better to publish it into your preferred pip artifactory.

You **do not need to edit ANY python files** yourself, all documentation and property validation are generated from the definition and comments of `propTypes` in your react component.

Note that it comes with different dependencies and a separate virtual env, you need to install:

- frontend dependencies with `npm install`
- python dependencies with `pip install`

> Note, that if you have a dash app, that already uses your component, and you make changes, it's not enough to build a new package, you need to increment the version number in package.json e.g with `npm version patch`

## Development

You can run tests (separate dependencies, `python3 tests/test_usage.py`), create a mini dash app (`usage.py`)

`npm start` is a really useful command to fire up a live reload webpack dev server to develop your react code in isolation.

Note that the styles are probably going to be different then where it's going to run, since you might use `dash-design-kit` or `bootstrap-components`.
But you can customize the `demo` index.js to look similar to the environment that you depend on, it won't be added to the final deployment.

### Dev tools

Docs: [Dash devtools](https://dash.plotly.com/devtools)

It can significantly improve developer experience to turn on the developer tools.

Livereload, error messages in the dashboard, callback graph with proper information about the current run, and many more.

```py
server = app.server
if __name__ == "__main__":
    debug_mode = True if os.getenv("DEBUG", "false") == "true" else False
    if debug_mode is True:
        print(f"Initiating server. Debug mode enabled.")
    else:
        ## Use enable_dev_tools when you want to turn on certain features when deploying your application with gunicorn.
        # app.enable_dev_tools(
        #   dev_tools_ui=True,
        #   dev_tools_serve_dev_bundles=True,
        # )
        print(f"Initiating server.")

    app.run_server(
        debug=debug_mode,
        host="0.0.0.0",
        port=5000
    )
```

### Annoying errors

- `Exception has occurred: SyntaxError expression cannot contain assignment, perhaps you meant "=="?`, you most probably missed a comma at the end of a line duing editing the the layout.
- `Exception has occured: SystemExit`. You can ignore this. In VSCode livereload triggers this error.

## Metadata/Docs

At first I started to develop using a very old dash version, and migration was not an option.
I looked for solutions to common problems online, but many times they were not suited for my stack.

It helped me a lot to get to know the components in github source.
You can see the installed python packages as well. They follow the same format, and are self-documented.
It's easy to see which properties were available on the installed versions.

{{< adarticle >}}

### Used versions

There might be better ways since I wrote this developer summary, The versions I used at the time of writing:

```js
Plotly version: 1.58.4
Dash version: 1.19.0
dash-core-components: 1.15.0
dash-html-components: 1.1.2
```

## Disclaimer

I was not asked for this post, I'm not affiliated with plotly in any way.

## Moving forward

Did you find what you were looking for?

- In the [top of the page](#useful-links-for-getting-started) there are many useful links
- I wrote about a [demo plotly-dash app](/posts/2021/04/08/strava-activities-with-plotly/) with an example on [github](https://github.com/budavariam/activity-visualizer)

If it's still not enough, feel free to leave a comment below or reach out via [email](mailto:budavariam@gmail.com?subject=Plotly%20blog%20post).

Happy coding!
