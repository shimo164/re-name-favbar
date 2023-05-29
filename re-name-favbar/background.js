chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
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
    chrome.storage.sync.set({ textMappings: defaultMapping }, function () {
      console.log('Default textMappings set');
    });
  }
});

init = (tab) => {
  if (!tab) {
    console.log('Tab not found');
    return;
  }

  // Check if the tab URL matches the AWS Console pattern
  if (/^https?:\/\/([a-z0-9-]+\.)*console\.aws\.amazon\.com\//.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['content_script.js'],
      })
      .catch((error) => {
        console.log(`Error executing script: ${error}`);
      });
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete') {
    init(tab);
  }
});
