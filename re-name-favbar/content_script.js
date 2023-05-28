// Define a mapping of AWS service names to their shortened versions
(function () {
  // Load mappings from local storage and merge with default mappings
  chrome.storage.sync.get('textMappings', function (data) {
    let textMapping = processMappings(data.textMappings || '');
    mainFunction(textMapping);
  });

  // Convert the raw mappings from storage into an object for easier use.
  function processMappings(rawMappings) {
    let textMapping = {};
    // Check if the rawMappings is already an object
    if (typeof rawMappings === 'object' && rawMappings !== null) {
      // If it's an object, we can directly use it
      textMapping = rawMappings;
    } else if (typeof rawMappings === 'string') {
      // If it's a string, we process it as before
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

  // Main function that sets up the MutationObserver and calls the function to shorten service names.
  function mainFunction(textMapping) {
    function shortenServiceNames() {
      let wasChanged = false;

      const node = document.querySelector(
        '[data-rbd-droppable-id="global-nav-favorites-bar-list-edit-mode"]',
      );

      // If we couldn't find the node we're looking for, try again after a short delay.
      if (node) {
        const listItems = node.querySelectorAll('li');

        listItems.forEach(function (listItem, index) {
          const spanElement = listItem.querySelector('span');

          // If spanElement is not available yet, retry after a delay
          if (!spanElement || spanElement.innerText === '') {
            setTimeout(() => {
              shortenServiceNames();
            }, 300);
            return;
          }

          if (textMapping.hasOwnProperty(spanElement.innerText)) {
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
        setTimeout(shortenServiceNames, 300);
      }
    }

    // Utility function to ensure that a function is not called too frequently.
    function debounce(func, wait) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    }

    // Create a debounced version of our function to shorten service names.
    const debouncedShortenServiceNames = debounce(shortenServiceNames, 300);

    // Set up a MutationObserver to watch for changes to the DOM.
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
          debouncedShortenServiceNames();
        }
      });
    });

    // Start observing the entire body of the page for changes.
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();