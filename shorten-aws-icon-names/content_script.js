// Define a mapping of AWS service names to their shortened versions
// TODO: Move to Options and use Local Storage
let textMapping = {
  'API Gateway': 'API GW',
  'Application Discovery Service': 'ADS',
  'AppStream 2.0': 'AppStream',
  'AWS Auto Scaling': 'ASG',
  'Certificate Manager': 'ACM',
  CloudFormation: 'CFN',
  CloudFront: 'CF',
  CloudHSM: 'HSM',
  CloudSearch: 'CS',
  CloudWatch: 'CW',
  'Database Migration Service': 'DMS',
  'Direct Connect': 'DX',
  DynamoDB: 'DDB',
  'Elastic Beanstalk': 'EB',
  'Elastic Container Registry': 'ECR',
  'Elastic Container Service': 'ECS',
  'Elastic Kubernetes Service': 'EKS',
  'IoT Device Management': 'IoT DM',
  'Key Management Service': 'KMS',
  'Managed Apache Airflow': 'MAA',
  'Resource Access Manager': 'RAM',
  'Route 53': 'R53',
  'Service Catalog': 'SC',
  'Simple Notification Service': 'SNS',
  'Simple Queue Service': 'SQS',
  'Step Functions': 'SF',
  'Storage Gateway': 'SG',
  'Systems Manager': 'SSM',
  'Trusted Advisor': 'TA',
  'WAF & Shield': 'WAF',
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
