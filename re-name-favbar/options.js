const defaultMapping = {
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

// Initialize the toggles with their saved states or defaults.
chrome.storage.sync.get(['extensionEnabled', 'emptyAllNames'], function (data) {
  document.getElementById('extensionToggle').checked =
    data.extensionEnabled !== false; // default: true
  document.getElementById('emptyNamesToggle').checked =
    data.emptyAllNames === true; // default: false
});

// Save the state of the toggles whenever they are changed.
document
  .getElementById('extensionToggle')
  .addEventListener('change', function () {
    chrome.storage.sync.set({ extensionEnabled: this.checked });
  });
document
  .getElementById('emptyNamesToggle')
  .addEventListener('change', function () {
    chrome.storage.sync.set({ emptyAllNames: this.checked });
  });

// Attach event listeners to buttons for saving and resetting options.
document.getElementById('saveButton').addEventListener('click', saveOptions);
document.getElementById('resetButton').addEventListener('click', resetOptions);

// When the options page is loaded, display the current mappings.
document.addEventListener('DOMContentLoaded', populateOptions);

// Display a message indicating when the mappings were last saved.
function displaySaveMessage() {
  const saveMessage = document.getElementById('saveMessage');
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(now.getDate()).padStart(2, '0')} ${String(
    now.getHours(),
  ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
    now.getSeconds(),
  ).padStart(2, '0')}`;
  saveMessage.textContent = `Saved at ${timestamp}`;
}

// Retrieve the current mappings from storage and display them on the options page.
function populateOptions() {
  chrome.storage.sync.get('textMappings', function (data) {
    document.getElementById('mappings').value = convertMappingsToString(
      data.textMappings || defaultMapping,
    );
  });
}

// Save the user's mappings into storage and display a save message.
function saveOptions() {
  let userMappings = convertStringToMappings(
    document.getElementById('mappings').value,
  );
  chrome.storage.sync.set({ textMappings: userMappings }, function () {
    displaySaveMessage();
  });
}

// Reset the mappings to the defaults, save them into storage, and display them on the options page.
function resetOptions() {
  if (confirm('Are you sure you want to reset to default mappings?')) {
    chrome.storage.sync.set({ textMappings: defaultMapping }, function () {
      populateOptions();
      displaySaveMessage();
    });
  }
}

// Convert a mappings object to a string for display in the text area.
function convertMappingsToString(mappings) {
  let result = '';
  for (let key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      result += key + ',' + mappings[key] + '\n';
    }
  }
  return result;
}

// Convert a string from the text area to a mappings object for storage.
function convertStringToMappings(string) {
  let mappings = {};
  let lines = string.split('\n');
  for (let line of lines) {
    let parts = line.split(',');
    if (parts.length == 2) {
      mappings[parts[0].trim()] = parts[1].trim();
    }
  }
  return mappings;
}
