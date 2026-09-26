# flexular

> An open-source multipurpose Electron app that is made to be modular and flexible (hence the name).

### Overview

This was originally made so that I could avoid making separate entire apps for some small things I wanted.

This app was made in `JavaScript` with `Electron` and `Lit`. 

`Main` contains the main app, housing main assets and resources for the app, including the initial page, the menu bar and the side bar.
<br/>
`Modules` contains the different modules that can be used in the app, which includes the default ones and your custom ones.

### Flexular Module Structure
The `index.js` file in the root of your module is run in the backend when the app is opened.

The `component.js` file in the root of your module is the entry point for the user interface for your module. The `component.js` should always have `tag` exported as a string.

Those two files, on top of `package.json` are the minimum files for a module.

### Compiling/Packaging
Use `npm install` to install all base dependencies and Flexular module dependencies.

After use the following:
```
npm run build
```

### Preinstalled/Default Flexular Modules
- timewatch - Tracks multiple stopwatches.
- nurture - Sends reminders to the user via notifications to drink water.
- template - This module serves to be a template to make modules.

See the `README.md` of each respective module to find more information on the module itself.