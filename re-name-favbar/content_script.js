// IIFE to avoid polluting the global namespace
(function () {
  // Load extension data from storage
  chrome.storage.sync.get(
    ['textMappings', 'extensionEnabled', 'emptyAllNames'],
    function (data) {
      if (!data.extensionEnabled) {
        // If the extension is disabled, don't proceed with renaming
        return;
      }
      // If the extension is enabled, initiate the renaming process
      mainFunction(data);
    },
  );

  // Function to convert raw text mappings into an object for easier manipulation
  function processMappings(rawMappings) {
    let textMapping = {};

    if (typeof rawMappings === 'object' && rawMappings !== null) {
      textMapping = rawMappings;
    } else if (typeof rawMappings === 'string') {
      let mappings = rawMappings.split('\n');
      for (let mapping of mappings) {
        let parts = mapping.split(',');
        if (parts.length == 2) {
          textMapping[parts[0].trim()] = parts[1].trim();
        }
      }
    }
    return textMapping;
  }

  // Main function that sets up the MutationObserver and calls the renaming function
  function mainFunction(data) {
    const renameServiceNames = () => {
      let wasChanged = false;
      // If 'emptyAllNames' is enabled, use an empty object; otherwise, process mappings
      let textMapping = data.emptyAllNames
        ? {}
        : processMappings(data.textMappings || '');
      const node = document.querySelector(
        '[data-rbd-droppable-id="global-nav-favorites-bar-list-edit-mode"]',
      );

      if (node) {
        const listItems = node.querySelectorAll('li');
        listItems.forEach((listItem, index) => {
          const spanElement = listItem.querySelector('span');
          if (!spanElement || spanElement.innerText === '') {
            setTimeout(() => {
              renameServiceNames();
            }, 300);
            return;
          }

          if (data.emptyAllNames) {
            spanElement.innerText = '';
            wasChanged = true;
          } else if (textMapping.hasOwnProperty(spanElement.innerText)) {
            spanElement.innerText = textMapping[spanElement.innerText];
            wasChanged = true;
          } else {
            spanElement.innerText = spanElement.innerText.replace(
              /^(AWS|Amazon) /,
              '',
            );
            wasChanged = true;
          }
        });

        if (wasChanged) {
          observer.disconnect();
        }
      } else {
        setTimeout(renameServiceNames, 300);
      }
    };

    const debounce = (func, wait) => {
      let timeout;
      return function () {
        const context = this,
          args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    };

    const debouncedRenameServiceNames = debounce(renameServiceNames, 300);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          debouncedRenameServiceNames();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
