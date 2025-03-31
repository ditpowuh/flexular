# flexular

> An open-source multipurpose Electron app that is made to be modular and flexible (hence the name).

This was originally made so that I could avoid making seperate entire apps for some small things I wanted.

`Main` contains a lot of the main assets and resources for the app, including the styling, the menu bar and the side bar.
<br>
`Modules` contains the different modules that can be used in the app, which can include the default ones and your custom ones.

### Module Structure
`index.html` in the root of your module will be the first page that it is opened up to when navigated to by the side bar.
<br>
`index.js` in the root of your module is run in the backend when the app is opened.
<br><br>
The rest of the structure can be anything within the module. Though for consistency, `CSS` should contain CSS files and `JS` should contain JavaScript files.

### Compiling/Packaging
Use `npm install` to install all base dependencies and Flexular module dependencies.
#### Universal
```
npx @electron/packager . Flexular --icon=Main/Icon.png --out=output/ --overwrite --ignore="\.bat$"
```
