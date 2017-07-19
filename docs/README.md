<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [API Functions](#api-functions)
        - [Attribute Translation](#attribute-translation)
        - [Users](#users)
            - [fetchUsers](#fetchusers)
            - [fetchUser](#fetchuser)
            - [createUser](#createuser)
            - [updateUser](#updateuser)
            - [deleteUser](#deleteuser)
        - [Teams](#teams)
            - [fetchTeams](#fetchteams)
            - [fetchTeam](#fetchteam)
            - [createTeam](#createteam)
            - [updateTeam](#updateteam)
            - [deleteTeam](#deleteteam)
        - [Space](#space)
            - [fetchSpace](#fetchspace)
        - [Kapp](#kapp)
            - [fetchKapps](#fetchkapps)
            - [fetchKapp](#fetchkapp)
        - [Forms](#forms)
            - [fetchForms](#fetchforms)
            - [fetchForm](#fetchform)

<!-- markdown-toc end -->


# Installation

`npm install --save react-kinetic-core`

or

`yarn add react-kinetic-core`

In order to use the `CoreModal` components you will need to include the appropriate CSS:

`import 'react-kinetic-core/styles/modal.scss';`

# Usage

All of the components and functions are available directly through the package.

## API Functions

### Attribute Translation

The API functions automatically translate attributes into a friendly JS format. For example an object that looks like this:

```
{
  "name": "Thing",
  "slug": "thing",
  "attributes": [
    { "name": "Attribute1", "values": ["Value1"] },
    { "name": "Attribute2", "values": ["Value2-1", ""Value2-2"] }
  ]
}
```

Will be automatically translated to look like this:

```
{
  "name": "Thing",
  "slug": "thing",
  "attributes": {
    "Attribute1": ["Value1"] },
    "Attribute2": ["Value2-1", ""Value2-2"] }
  }
}
```

Instead of having to access attributes by iterating through the array you can access them directly by name: `thing.attributes.Attribute1.values` or `thing.attributes['Attribute Name'].values`. This makes using attributes easier in your frontend code.

The API functions will automatically convert attributes back to the Array notation when you're using the update methods.

For resources with multiple types of attributes, such as `Users` which have `attributs` and `profileAttributes` the API functions will automatically convert both attribute types.

**NOTE**

When you include child items, for example the forms for a kapp (`include=form,form.attributes`) the API helpers will not "crawl" through child objects to translate their attributes. It only translates the top level object or collection of objects.

### Users

`import { UsersAPI } from 'react-kinetic-core';`

#### fetchUsers

Fetch all users for the current space.
 
`UsersAPI.fetchUsers(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ users: [ { /* ... */ } ] }`

#### fetchUser

Fetch a specific user by username for the current space.

`UsersAPI.fetchUser(options)`

`options`:
* `username` - (required) The username of the user to retrieve.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ user: { /* ... */ } }`

#### createUser

Creates a new user in the current space.

`UsersAPI.createUser(options)`

`options`:
* `user` - (required) the user object to create/insert.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ user: { /* ... */ } }`

#### updateUser

Update a user using a username and a user object.

`UsersAPI.updateUser(options)`

`options`:
* `username` - (required) the username of the user to be updated.
* `user` - (required) the user object to send to the server.
* `include` - API include parameters (see Kinetic CE reference documentation).


#### deleteUser

Deletes the user specified by the `username` option.

`UsersAPI.deleteUser(options)`

`options`:
* `username` - (required) the username of the user to be deleted.

Resolves: nothing.

### Teams

`import { TeamsAPI } from 'react-kinetic-core';`

#### fetchTeams

Fetch all teams for the current space.
 
`TeamsAPI.fetchTeams(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ teams: [ { /* ... */ } ] }`

#### fetchTeam

Fetch a specific team by slug for the current space.

`TeamsAPI.fetchTeam(options)`

`options`:
* `teamSlug` - (required) The slug of the team to retrieve.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ team: { /* ... */ } }`

#### createTeam

Creates a new team in the current space.

`TeamsAPI.createTeam(options)`

`options`:
* `team` - (required) the team object to create/insert.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ team: { /* ... */ } }`

#### updateTeam

Update a team using a teamSlug and a team object.

`TeamsAPI.updateTeam(options)`

`options`:
* `teamSlug` - (required) the slug of the team to be updated.
* `team` - (required) the team object to send to the server.
* `include` - API include parameters (see Kinetic CE reference documentation).


#### deleteTeam

Deletes the team specified by the `teamSlug` option.

`TeamsAPI.deleteTeam(options)`

`options`:
* `teamSlug` - (required) the slug of the team to be deleted.

Resolves: nothing.

### Space

`import { SpaceAPI } from 'react-kinetic-core';`

#### fetchSpace

Fetches the current space.

`SpaceAPI.fetchSpace(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

### Kapp

`import { KappsAPI } from 'react-kinetic-core';`

#### fetchKapps

Fetches all Kapps for the current space.

`KappsAPI.fetchKapps(options)`
 
`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ kapps: [{ /* ... */ }] }`

#### fetchKapp

Fetches a Kapp from the current using the `kappSlug` option.

`KappsAPI.fetchKapp(options)`

`options`:
* `kappSlug` - the slug of the Kapp to fetch. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ kapp: { /* ... */ } }`

### Forms

`import { FormsAPI } from 'react-kinetic-core';`

#### fetchForms

Fetches all forms for the current space and Kapp. The Kapp can be overridden using the `kappSlug` option.

`FormsAPI.fetchForms(options)`
 
`options`:
* `kappSlug` - the slug of the Kapp in which to fetch forms. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ forms: [{ /* ... */ }] }`

#### fetchForm

Fetches the form specified by the `formSlug` option in the current space and Kapp.
The Kapp can be overridden using the `kappSlug` option.

`FormsAPI.fetchForms(options)`
 
`options`:
* `formSlug` - (required) the slug of the form to fetch.
* `kappSlug` - the slug of the Kapp in which to fetch forms. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ form: { /* ... */ } }`
