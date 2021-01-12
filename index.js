const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');
const https = require('https')

try {
  // Action Inputs
  const token = core.getInput('token')
  const name = core.getInput('name')
  const org = core.getInput('org')
  const desc = core.getInput('desc')
  var exec_mode = core.getInput('exec_mode')
  var tf_version = core.getInput('tf_version')
  const env = core.getInput('env')

  if (!exec_mode) {
    exec_mode = 'remote'
  } else {
    exec_mode = exec_mode.toLocaleLowerCase()
  }
  if (exec_mode != 'local' && exec_mode != 'remote') {
    throw ('Invalid value for "exec-mode"')
  }

  // Build JSON Payload with Inputs
  const data = JSON.stringify({
    "data": {
      "attributes": {
        "name": name,
        "description": desc,
        "environment": env,
        "readme": null,
        "execution-mode": exec_mode.toLowerCase(),
        "auto-apply": false,
        "working-directory": "",
        "terraform-version": tf_version,
        "allow-destroy-plan": true,
        "auto-destroy-at": null,
        "vcs-repo": null,
        "file-triggers-enabled": false,
        "trigger-prefixes": []
      },
      "relationships": {
        "organization": {
          "data": {
            "type": "organizations",
            "id": org
          }
        }
      },
      "type": "workspaces"
    }
  })

  // Build Request Options from Inputs
  const options = {
    hostname: 'app.terraform.io',
    port: 443,
    path: `/api/v2/organizations/${org}/workspaces`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Create New Workspace
  const req = https.request(options, res => {
    if (res.statusCode == '201') {
      console.log(`Workspace named "${name}" created in the "${org}" organization.`)
    } else if (res.statusCode == '401') {
      console.log(`Unauthorized to created workspace in the "${org}" organization.`)
    } else if (res.statusCode == '404') {
      console.log(`Organization "${org}" not found in Terraform Cloud.`)
    } else {
      res.on('data', d => {
        if (d.includes('Name has already been taken')) {
          console.log(`Workspace named "${name}" already exists in the "${org}" organization.`) 
        } else {
          process.stdout.write(d)
        }
      })
    }
    return res
  })
  req.write(data)
  req.end()
} catch (error) {
  console.log(error)
  core.setFailed(error.message)
}