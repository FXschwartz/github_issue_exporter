import { Octokit } from '@octokit/core';
import fetch from 'cross-fetch';

const octoKit = new Octokit({auth: ''});

async function getGithubIssues() {
    const response = await octoKit.request('GET /orgs/Flowline/issues', {
        org: 'flowline',
        per_page: 100,
        filter: 'all',
        page: '5',
        state: 'all',
    });
    // console.log('response', response);
    const issues = response.data.map((issue: any) => {
        return {
            'summary': issue.title,
            description: issue.body ?? '',
            'status': issue.state === 'open' ? 'Open' : 'Done',
            assignee: issue.assignee?.login,
            'externalId': issue.id.toString(),
            externalName: issue.title,
            externalUrl: issue.html_url,
        }
    });
    // console.log('issues: ', issues);
    const jetbrainsResponse = await importGithubIssuesIntoJetbrains(issues);
    console.log('jetbrainsResponse: %o ', jetbrainsResponse);
}

async function importGithubIssuesIntoJetbrains(body : any) {
    const jsonBody = JSON.stringify(body);
    console.log('jsonBody: ', jsonBody);
    const response = await fetch('https://saturn5.jetbrains.space/api/http/projects/id:2bHb1k2fetzY/planning/issues/import', {
    method: 'POST',
    headers: {
        'Authorization': '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      "metadata": {
        "importSource": "github"
      },
      "issues": [],
      "assigneeMissingPolicy": "replace-with-default",
      "statusMissingPolicy": "replace-with-default",
      "onExistsPolicy": "update",
      "dryRun": false
    })
});
    return response;
}

getGithubIssues();

