// Define a mapping of AWS service names to their shortened versions
// TODO: Move to Options and use Storage
const textMapping = {
  CloudFormation: 'Cfn',
  CloudWatch: 'CW',
  Lambda: '',
  EC2: '',
  DynamoDB: 'DDB',
  'Step Functions': 'Sfn',
  'Simple Notification Service': 'SNS',
  'Simple Queue Service': 'SQS',
  'API Gateway': 'APIGW',
  'Elastic Kubernetes Service': 'EKS',
  'Elastic Container Service': 'ECS',
  'Elastic Container Registry': 'ECR',
  'Route 53': 'R53',
  'Direct Connect': 'DX',
  'Resource Access Manager': 'RAM',
};

// Function to shorten AWS service names in the navigation bar
function shortenServiceNames() {
  // Find the navigation bar element
  const node = document.querySelector(
    '[data-rbd-droppable-id="global-nav-favorites-bar-list-edit-mode"]',
  );

  if (node) {
    // Find all list items within the navigation bar
    const listItems = node.querySelectorAll('li');

    // Iterate through the list items and update the text
    listItems.forEach(function (listItem) {
      const spanElement = listItem.querySelector('span');
      console.log(spanElement.innerText);
      if (spanElement && textMapping.hasOwnProperty(spanElement.innerText)) {
        // If the text is in the textMapping object, update it
        spanElement.innerText = textMapping[spanElement.innerText];
      } else if (spanElement) {
        // If the text contains "AWS " or "Amazon ", remove it
        spanElement.innerText = spanElement.innerText.replace(
          /^(AWS|Amazon) /,
          '',
        );
      }
    });
  }
}

// Debounce function to limit the rate at which a function is called
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

// Wrap the shortenServiceNames function with debounce to limit its execution rate
const debouncedShortenServiceNames = debounce(shortenServiceNames, 300);

// Create a MutationObserver to detect changes in the DOM
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // Check if any nodes were added
    if (mutation.addedNodes.length > 0) {
      // Call the debounced version of the shortenServiceNames function
      debouncedShortenServiceNames();
    }
  });
});

// Start observing the DOM for changes (both direct and nested)
observer.observe(document.body, { childList: true, subtree: true });
