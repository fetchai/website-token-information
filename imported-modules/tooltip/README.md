# Tooltip

## Install

```sh
$ npm install tooltip --save
```

## Usage

```js
var tooltip = require('tooltip')

tooltip()
```

```html
<h2 data-tooltip="tooltip text">Test the tooltip</h2>
```
Now hover over h2 and the tooltip will show.

Or, with config:

```js
var tooltip = require('tooltip')
var config  = {
  showDelay: 100,
  style: {
    padding: 5
  }
}

tooltip(config)
```

## Configs

 * target - defaults to `document.documentElement`. Tooltips will be displayed only for elements inside target.
 * style  - styles to be applied to the tooltip element
 * className - a css class to be applied to the tooltip element. Defaults to `"tooltip"`
 * showDelay - defaults to `500` ms
 * visibleStyle - style to be applied to the tooltip element when it is visible
 * hiddenStyle - style to be applied to the tooltip element when it is hidden
 * appendTooltip: Function - a function to append the tooltip (defaults to doing `document.body.appendChild(tooltipElement)` )
 * offset - defaults to { x: 5, y: 5 }
 * attrName - defaults to `"data-tooltip"`. Tooltip will show on hover over elements with this attribute.

    Specify `data-tooltip-positions="top;bottom;left;right"` to dictate the order of the positions preferred by the tooltip.

## License

#### MIT