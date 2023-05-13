# shorten-aws-icon-names
This Chrome extension simplifies your AWS console experience by shortening the names of AWS service icons. By automatically modifying the text in the DOM, the extension replaces the long service names with more concise abbreviations.

## Example of how the extension works

Without shorten-aws-icon-names extension:
![](img/navibar-before.png)

With shorten-aws-icon-names extension:
![](img/navibar-after.png)

## Settings

In `content_script.js`, the preset mappings for service name abbreviations are defined within the `textMapping` object.

```js
const textMapping = {
  'API Gateway': 'API GW',
  ...
```

The first entry in the object means `API Gateway` will be changed to `API GW`.

You can also set the name to be empty, like `API Gateway': '',`.

If a service name is not specifically defined in the textMapping object, any `AWS` and `Amazon` prefixes will be removed.



## How to Install the Chrome Extension in Developer Mode

1. Download the extension folder to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top right corner.
4. Click on the **Load unpacked** button.
5. Browse to the downloaded extension folder, select it, and click **Open**.
6. The extension will now be installed in Developer mode.

For more information on using Chrome extensions in Developer mode, you can visit the [Google Chrome Enterprise Help page](https://support.google.com/chrome/a/answer/2714278?hl=en).


## Contributing

Contributions to this project are warmly welcomed! Please feel free to open an issue or submit a pull request.

# TODO
- Use Option page to change the textMapping
- Set icons
- Add preset mappings (if any)
