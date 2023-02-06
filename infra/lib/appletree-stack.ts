import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { CfnApp, CfnBranch } from 'aws-cdk-lib/aws-amplify';
import 'dotenv/config';

export class AppletreeStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environmentVariables = [
      {
        name: 'REACT_APP_HESTIA_SERVICE_API_URL',
        value: process.env.REACT_APP_HESTIA_SERVICE_API_URL || ''
      }
    ]

    const repo = new Repository(this, 'appleTree-repository', {
      repositoryName: 'appletree',
    });

    const amplify = new CfnApp(this, 'appletree-amplify-app', {
      name: 'appletree-amplify-app',
      repository: repo.repositoryCloneUrlHttp,
      enableBranchAutoDeletion: false,
      environmentVariables: [...environmentVariables],
      customRules: [
        {
          source: '</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>',
          target: '/index.html',
          status: '200',
        },
      ],
    });

    new CfnBranch(this, 'AmplifyBranch', {
      appId: amplify.attrAppId,
      branchName: 'main',
      enableAutoBuild: true,
    });
  }
}
