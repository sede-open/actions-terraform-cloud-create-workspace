# actions-terraform-cloud-create-workspace
This is a github action to create Workspaces in Terraform Cloud.

## Usage:

```YAML
- uses: Bardavon-Health/actions-terraform-cloud-create-workspace@v1.0
  with:
    token: ${{ secrets.TF_TEAM_TOKEN }}
    name: myWorkspace
    org: myOrg
```
---
## Required Parameters:
#### token:
Terraform Cloud API Token. Can be Organization, Team or User Token with permission to create Workspaces.
#### name:
Name of Workspace to create.
#### org:
Name of parent Organization for the new Workspace.
<br />

## Optional Parameters:
#### desc:
Workspace Description. 
#### exec_mode:
Default is "remote", "local" will cause Terraform to run in Github Actions.
#### env:
Workspace Environment. 
#### tf_version:
Version of Terraform version. 

---
### License
MIT