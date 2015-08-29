# angularjs scrollspy directive

#### angular-scrollspy is a simple scrollspy directive for angularjs

This module is an event driver scrollspy directive. In other words is uses events to highlight the right anchor at the right time. I guess this is a more efficient approach to list/array solutions. In any case in a good showcase of angularjs events.

## Demo
to come

## Dependencies
```
"dependencies": {
  "angular":"~1.2.0",
  "angular-animate":"~1.2.0",
  "angular-sanitize":"~1.2.0",
},
```

TODO: should just rely on angularjs.
TODO: use an newer version

## Install

##### Bower
```
bower install davidecavaliere/angualar-scrollspy
```
##### app.js
inject the module
```
'davidecavaliere.angular-scrollspy'
```

##### the view

set up the anchors

```html
<div style="float: right; position: fixed; background-color: white">
  <ul>
    <li scrollspy-receiver="'first'">first</li>
    <li scrollspy-receiver="'second'">second</li>
    <li scrollspy-receiver="'third'">third</li>
    <li scrollspy-receiver="'fourth'">fourth</li>
    <li scrollspy-receiver="'fifth'">fifth</li>
    <li scrollspy-receiver="'sixth'">sixth</li>
  </ul>
</div>
```

set up the triggers

```html
<div style="height:1000px; background-color: white;">1</div>
<div scrollspy-trigger="'first'" style="height:200px; background-color: red;">1</div>
<div scrollspy-trigger="'second'" style="height:300px; background-color: pink;">2</div>
<div scrollspy-trigger="'third'" style="height:400px; background-color: yellow;">3</div>
<div scrollspy-trigger="'fourth'" style="height:500px; background-color: red;">4</div>
<div scrollspy-trigger="'fifth'" style="height:600px; background-color: pink;">5</div>
<div scrollspy-trigger="'sixth'" style="height:900px; background-color: yellow;">6</div>
```

You're done

## Documentation
See the `scrollspy.js` and `home.html` for source code and example
https://github.com/davidecavaliere/angular-scrollspy


## Development

#### This project is still in a early stage. IS NOT PRODUCTION READY. Even though it is fully functional has not been tests. Use at your own risk.

#### You're more than welcome to fork and contribute to this project. It uses yeoman's `generator-angular-module` so please check [https://www.npmjs.com/package/generator-angular-module](https://www.npmjs.com/package/generator-angular-module).
