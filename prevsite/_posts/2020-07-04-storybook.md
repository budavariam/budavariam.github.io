---
layout: post
title: Storybook
tags: programming storybook component-library
comments: true
---

When I develop new web components I find it frustrating that I have to run the app,
click it through until the point I find my new visual, just to see how it behaves in a real life situation.
Unit tests are great to check whether my component does what I intended,
but styling is a whole different story.
I've been looking for a component preview library for React,
that is not invasive and I do not need to change my code with extra markup to make it work,
[Storybook](https://storybook.js.org/) does exactly what I was looking for.

## What is this

They summarized what their library is about in their [introduction page](https://storybook.js.org/docs/basics/introduction/).

>Storybook is a user interface development environment and playground for UI components.
>The tool enables developers to create components independently and showcase components interactively
>in an isolated development environment.
>
>Storybook runs outside of the main app so users can develop UI components in isolation without
>worrying about app specific dependencies and requirements.

I heard about this library first in the [Ladybug Podcast](https://www.ladybug.dev/) episode 13
[Design systems](https://github.com/ladybug-podcast/ladybug-website/blob/master/transcripts/13-design-systems.md).
I did not look into it then, but when I needed to create a showcase of some of my components I decided to give it a try.

Next time I had to create a totally new component, I enjoyed the benefits of the focused development, and not having to run the whole app.

You can [get started](https://storybook.js.org/docs/guides/quick-start-guide/) easily for multiple frameworks.

## My code organizing experience

I do not want to get into how to get started they have many good
[tutorial paths](https://www.learnstorybook.com/) depending on what you want to use it for.

I got started with `npx -p @storybook/cli sb init --type react_scripts`, this boilerplate code uses number prefixed stories,
and put everything into one `stories` folder.

For my use case I found it better to **name the story files the same** as the component and **put it next** to them.

This script adds the necessary dependencies, and adds storybook related code as devDependencies.
It takes some time to get it all together, and I usually don't need these in my CI pipelines,
so I moved these to [optionslDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies),
and call `npm install` with `--no-optional` flag.

## One entrypoint rules them all

I created a `index.storybook.js` file, to import all the necessary things that my stories need, so they can behave consistently.
This file need to be imported into every `.stories.js` file, and it will take care of the common logic.

If I want to mimic the look and feel of my app I need to **include the same styles** that my app uses.
To avoid any potential issues I prefer to import them in the same order, to avoid misbehaving style overrides due to ordering differences.

Also I need to include any other dependencies that my components might need, e.g i18n, so the components' behaviour can stay the same.

In order to showcase my components I provided some **mock data** to use throughout the components.
These are not used anywhere in the real app.
I do not want to repeat them many times, this entrypoint can contain them, or reexport them from their separate location.

## Decorators for repeated logic

In react data for a component can come from props, context.

For a component that needs a provider to work, you need to return your component wrapped in that provider.
If that provider is used by many of your components your stories will have many repeated wrapped code.
This is where [decorators](https://storybook.js.org/docs/basics/writing-stories/#decorators) come in handy

### Simple provider

The decorator can wrap around the component and it won't need to repeat this code.

```jsx
export const modalProviderDecorator = (storyFn) => <ModalProvider>{storyFn()}</ModalProvider>
```

The only thing is that the story declaration must add the necessary decorators for the component definition.
Be aware that it applies them in the specified order.

```js
export default {
    title: "CustomComponent",
    component: CustomComponent,
    decorators: [
        modalProviderDecorator,
    ],
}
```

### React Router

I did not yet needed to mock different routes, I only needed to make my components
work that use location info. This small snippet made those work.

```jsx
import { createMemoryHistory } from "history"
import { Router, Route } from "react-router-dom"

export const addRouter = (storyFn) => (
    <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
        <Route path="/" component={() => storyFn()} />
    </Router>
)
```

### Custom data in Provider

Your component might need to act differently if there's something in one of its contexts.
If you want to showcase this behaviour in different stories listed one by one this is a possible solution.

The intuitive solution would be to you create a function that creates the decorator,
and call it with a parameter, but it will encapsulate that data into its clojure, and it won't change if you rerun the code.

But if you simply add a global variable into the decorator you can change that
variable in the given story and it will render the component with that data.
This way you don't need to repeat the context definition, you can still use the decorators.

Here the `privileges` can be a global variable that changes depending on what story you render.

```jsx
const prv = { EDIT: "EDIT", VIEW: "VIEW" }
let privileges = []

export const addPrivilegeContext = (storyFn) => {
    return (<PrivilegeContext.Provider value={{ privileges }} >{storyFn()}</PrivilegeContext.Provider >)
    }
}

export default {
    title: 'CustomComponent',
    component: CustomComponent,
    decorators: [
        addPrivilegeContext,
    ],
};

export const ComponentWithEditorPrivilege = () => {
    privileges = [prv.EDIT]
    return <CustomComponent />;
}

export const ComponentWithViewerPrivilege = () => {
    privileges = [prv.VIEW]
    return <CustomComponent />;
}
```

> Note: Global variables are evil. I just want to point out that it is possible this way.

Note that this will only work if you have already loaded the storybook, and clicking through different pages,
if you arrive to this page then the default value will be used that is an empty aray in this case.
If this is not okay for you, you can still extract the logic to a function,
and wrap your component around it without using decorators.

## Knobs for interactivity

You can make your stories controlled with [knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs).

Basicly you'll have a tab in the bottom with controls, that can set the incoming props of your component.
You can see how it reacts to change, and change its input without changing the underlying code.

All you need to do is add `withKnobs` as the first decorator from `"@storybook/addon-knobs"`,
and define the possible values and settings for each story.

You can have many types, e.g. number, text, array, drowdown, multiselect,
and they can really supercharge your components.

I could create a blogpost just on knobs alone, I really enjoy this feature.

They are pretty amazing for example to **filter** mocked data only for those that you're interested in in your current usecase.

An other exciting use-case is that you can define a **dropdown** with keys, add the property **value combinations** into an object,
and when a selction is made, the values change all at once.
This way you can showcase and examine different states of the component to others **saving time**
by not having to click through many stories, and not having to type anything to get the different states.

## Disclaimer

I was not asked to create this post, and did not get anything for it,
I just wanted to share how simple it is to use and some of my experience with it.
