---
layout: post
title: Plotly Dash Development Tips
tags: []
cover:
  image: /images/2021-03-30-plotly-dash-development-tips/cover.png
  alt: Cover
  hidden: true
date: 2021-03-30
draft: true
---

<!--more-->

## Useful links for getting started

- [https://dash.plotly.com/layout](https://dash.plotly.com/layout) dash tutorials and concepts, great starting point
  - [https://dash.plotly.com/basic-callbacks](https://dash.plotly.com/basic-callbacks) Info on callbacks
  - [https://dash.plotly.com/callback-gotchas](https://dash.plotly.com/callback-gotchas) Note the rules of callbacks
- [https://plotly.com/python/](https://plotly.com/python/) a lot of plotly examples
- [https://plotly.com/python/reference/](https://plotly.com/python/reference/) very useful reference docs on the available properties
- [https://dash-bootstrap-components.opensource.faculty.ai/](https://dash-bootstrap-components.opensource.faculty.ai/) we can use this lib for responsive frontend
- [https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf) pandas cheatsheet
- [https://github.com/plotly/plotly.js/](https://github.com/plotly/plotly.js/*) plotly.js git repo: interseting because of the issues and source code
- [https://github.com/plotly/dash-recipes](https://github.com/plotly/dash-recipes) recipes for advanced usecases
- [https://github.com/ucg8j/awesome-dash](https://github.com/ucg8j/awesome-dash) curated list of further reading material, libs, talks and more
- tutorial to clear up confusion about customdata hovertemplate: [https://chart-studio.plotly.com/~empet/15366/customdata-for-a-few-plotly-chart-types/#/](https://chart-studio.plotly.com/~empet/15366/customdata-for-a-few-plotly-chart-types/#/)

## Enterprise dash links

- [https://COMPANYURL/Docs/dash-design-kit](https://COMPANYURL/Docs/dash-design-kit) dash design kit docs
- [https://COMPANYURL/Docs](https://COMPANYURL/Docs) dash enterprise docs

## Dash client side callbacks

[https://dash.plotly.com/clientside-callbacks](https://dash.plotly.com/clientside-callbacks)

Note: All examples use a single output, but we can pass an array as return value

Some examples can be found here: [https://github.com/plotly/dash/blob/dev/tests/integration/clientside/test_clientside.py](https://github.com/plotly/dash/blob/dev/tests/integration/clientside/test_clientside.py)

- If you do not want to update a value return **window.dash_clientside.no_update**
- If you do not want to update at all in that callback throw **window.dash_clientside.PreventUpdate** as an exception

## Access plotly events in dash

Note that the events can only be accessed from client side

[https://plotly.com/javascript/plotlyjs-events/](https://plotly.com/javascript/plotlyjs-events/) here's what you can do with plotly events

If you define a callback that is called after the figure has created/updated, you can subscribe to the plot events

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

Note if you register an eventlistener multiple times it will call its callback multiple times

Note: you can only subscribe to events if the plot has appeared in the DOM

### Unsubscribe from events

Plotly.js uses a NodeJS style EventEmitter API

[https://github.com/plotly/plotly.js/blob/master/src/lib/events.js#L56-L57](https://github.com/plotly/plotly.js/blob/master/src/lib/events.js#L56-L57)

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

## Dynamic update

[https://dash.plotly.com/live-updates](https://dash.plotly.com/live-updates)

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

Note: If you set the attributes of a DOM item from arbitrary js code, e.g. event handlers, it won't trigger a callback.

You can only respond to callback with one value, here's where this component shines, it lets you periodically call a callback, and set any other value.

## Animations

[https://plotly.com/python/animations/](https://plotly.com/python/animations/)

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

## State vs Input

[https://community.plotly.com/t/what-is-the-difference-between-input-and-state/35219](https://community.plotly.com/t/what-is-the-difference-between-input-and-state/35219)

The `@app.callback` decorator can have 3 parameters, Inputs, Outputs, and States.
Input triggers a refresh on change, State does not, only use the latest version of the value, that is available when the callback runs.

When you load the page for the first time, all callbacks will be called with the initial value.
If you calculate default values in the beginning, and you want to use them in an other callback, then if you add them as an Input, it will wait for that data, BUT if you add it as a State it won't wait for it, it will use the data that has been calculated until that point that your callback has been called.

## Prevent update of outputs

In case you do not need to refresh all values in a callback, you can tell plotly that it should keep the previous value, and thus it will not trigger other callback that depend on that value.

There are 2 types

- prevent any kind of update in the callback. It is called `PreventUpdate`, it should be raised as an exception
- do not update a single value it is called `no_update`, it should be returned as a value

### Clientside callback

- `return window.dash_clientside.no_update`
- `throw window.dash_clientside.PreventUpdate`

### Serverside callbacks

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

Note the values stored in data-attributes are strings.

One simple usecase is if you have a quickly changing data, you can store it in JS global variable, and have a clientside callback that stores it in a `data` prop of a div every 100ms, and then you can react to its changes in these fixed sampled times even from python code.

## Handle URL

Some basic examples, and concepts: [https://dash.plotly.com/urls](https://dash.plotly.com/urls)

Reference for Location element: [https://dash.plotly.com/dash-core-components/location](https://dash.plotly.com/dash-core-components/location)

## Custom components

Create a custom component. Basically write only react code. Defined props can be updated with the usual callbacks, it can tell dash, that it's data has changed, and trigger callbacks.

- [Getting started](https://dash.plotly.com/plugins)
- Create custom component boilerplate:

  ```bash
  pip install cookiecutter && cookiecutter https://github.com/plotly/dash-component-boilerplate.git
  ```

### Loading state

Dash renderer lets your component know if it is in a loading state, you can get that info with these properties.

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

dash_core_components comes with a Loading component, that automatically sees if one of its children is loading, if you wrap your component inside it, then there will be a common loading indicator without you having to worry about it.

### Update callback

In case your component makes changes that should trigger a dash callback, you can use setProps callback with the updated props

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

### Build & deploy

Run `python setup.py sdist` to build the app into a bundle, you can add the dist into requirements.txt even as a tar.gz file.

You do not need to edit python files yourself, all documentation and property validation come from the definition and comments of propTypes in your component.

Note that it comes with different dependencies and a separate virtual env, you need to install frontend dependencies with `npm install` and python dependencies with `pip install` as well.

Note, that if you have a dash app, that already uses your component, and you make changes, it's not enough to build a new package, you need to increment the version number in package.json e.g with `npm version patch`

### Development

You can run tests (separate dependencies, python3 tests/test_usage.py), create a mini dash app (usage.py)

`npm start` is a really useful command to fire up a live reload webpack dev server to develop your react code in isolation.

Note that the styles are definitley going to be different then where it's going to run, since you might use dash design kit or bootstrap components
