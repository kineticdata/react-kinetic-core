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

Returns: `{ users: [ { /* ... */ } ] }`

#### fetchUser

Fetch a specific user by username for the current space.

`UsersAPI.fetchUser(options)`

`options`:
* `username` - (required) The username of the user to retrieve.
* `include` - API include parameters (see Kinetic CE reference documentation).

Returns: `{ user: { /* ... */ } }`

#### createUser

#### updateUser

Update a user using a username and a user object.

`UsersAPI.updateUser(options)`

`options`:
* `username` - (required) the username of the user to be updated.
* `user` - (required) the user object to send to the server.
* `include` - API include parameters (see Kinetic CE reference documentation).


#### deleteUser
