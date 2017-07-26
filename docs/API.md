<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [API Functions](#api-functions)
    - [Error Handling](#error-handling)
    - [Attribute Translation](#attribute-translation)
    - [Examples](#examples)
        - [Promises](#promises)
        - [Sagas](#sagas)
    - [Profile](#profile)
        - [fetchProfile](#fetchprofile)
        - [updateProfile](#updateprofile)
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
    - [Categories](#categories)
        - [fetchCategories](#fetchcategories)
        - [fetchCategory](#fetchcategory)
    - [Submissions](#submissions)
        - [SubmissionSearch](#submissionsearch)
            - [Equality Functions](#equality-functions)
            - [Context Functions](#context-functions)
            - [Sorting Functions](#sorting-functions)
            - [Metadata Functions](#metadata-functions)
            - [Date Functions](#date-functions)
            - [Execution Functions](#execution-functions)
        - [searchSubmissions](#searchsubmissions)
        - [fetchSubmission](#fetchsubmission)
        - [createSubmission](#createsubmission)
        - [deleteSubmission](#deletesubmission)
    - [Bridged Resources](#bridged-resources)
        - [fetchBridgedResource](#fetchbridgedresource)
        - [countBridgedResource](#countbridgedresource)

<!-- markdown-toc end -->

# API Functions

All API functions are available through the `CoreAPI` export:

`import { CoreAPI } from 'react-kinetic-core';`

## Error Handling

All API functions will gather up rejections and format them so that they resolve data in a consistent manner.

If the status code from the server is 400 and there is an `errors` key in the response data the API will resolve like this: `{ errors: ['Errors.'] }`.

For all other status codes or when 400 does not have an `errors` key in the response data the API will resolve like this: `{ serverError: { status: 500, statusText: 'Not right.' } }`

## Attribute Translation

The API functions automatically translate attributes into a friendly JS format. For example an object that looks like this:

```
{
  "name": "Thing",
  "slug": "thing",
  "attributes": [
    { "name": "Attribute1", "values": ["Value1"] },
    { "name": "Attribute2", "values": ["Value2-1", "Value2-2"] }
  ]
}
```

Will be automatically translated to look like this:

```
{
  "name": "Thing",
  "slug": "thing",
  "attributes": {
    "Attribute1": ["Value1"],
    "Attribute2": ["Value2-1", ""Value2-2"]
  }
}
```

Instead of having to access attributes by iterating through the array you can access them directly by name: `thing.attributes.Attribute1.values` or `thing.attributes['Attribute Name'].values`. This makes using attributes easier in your frontend code.

The API functions will automatically convert attributes back to the Array notation when you're using the update methods.

For resources with multiple types of attributes, such as `Users` which have `attributes` and `profileAttributes` the API functions will automatically convert both attribute types.

**NOTE**

When you include child items, for example the forms for a kapp (`include=form,form.attributes`) the API helpers will not "crawl" through child objects to translate their attributes. It only translates the top level object or collection of objects.

## Examples

### Promises

The API functions, with the exception of helpers such as `CoreAPI.SubmissionSearch`, all return promises.

Here's an example of retrieving a list of teams:

```
CoreAPI.fetchTeams().then(
  ({ serverError, teams }) => {
    serverError ?
      dispatch(actions.setErrors(serverError)) :
      dispatch(actions.setTeams(teams)));
```

In the event of using `redux-promise` you can simply have an action creator and handle the `serverError` vs `teams` logic in the reducer:

```
export const actions = {
  fetchTeams: () => ({ type: types.FETCH_TEAMS, payload: CoreAPI.fetchTeams() }),
};
```

### Sagas

In Sagas you would use the same deconstruction style in your saga:

```
export function* fetchTeamsSaga() {
  const { serverError, teams } = CoreAPI.fetchTeams();
  
  if (serverError) {
    yield put(actions.setError(serverError));
  } else {
    yield put(actions.setTeams(teams));
  }
}

```

## Profile

### fetchProfile

Fetch the profile of the currently authenticated user.

`CoreAPI.fetchProfile(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ profile: { /* ... */ } }`

### updateProfile

Updates the currently authenticated user's profile.

`CoreAPI.updateProfile(options)`

`options`:
* `profile` - (required) the user object to send to the server.
* `include` - API include parameters (see Kinetic CE reference documentation).

## Users

### fetchUsers

Fetch all users for the current space.
 
`CoreAPI.fetchUsers(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ users: [ { /* ... */ } ] }`

### fetchUser

Fetch a specific user by username for the current space.

`CoreAPI.fetchUser(options)`

`options`:
* `username` - (required) The username of the user to retrieve.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ user: { /* ... */ } }`

### createUser

Creates a new user in the current space.

`CoreAPI.createUser(options)`

`options`:
* `user` - (required) the user object to create/insert.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ user: { /* ... */ } }`

### updateUser

Update a user using a username and a user object.

`CoreAPI.updateUser(options)`

`options`:
* `username` - (required) the username of the user to be updated.
* `user` - (required) the user object to send to the server.
* `include` - API include parameters (see Kinetic CE reference documentation).


### deleteUser

Deletes the user specified by the `username` option.

`CoreAPI.deleteUser(options)`

`options`:
* `username` - (required) the username of the user to be deleted.

Resolves: nothing.

## Teams

### fetchTeams

Fetch all teams for the current space.
 
`CoreAPI.fetchTeams(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ teams: [ { /* ... */ } ] }`

### fetchTeam

Fetch a specific team by slug for the current space.

`CoreAPI.fetchTeam(options)`

`options`:
* `teamSlug` - (required) The slug of the team to retrieve.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ team: { /* ... */ } }`

### createTeam

Creates a new team in the current space.

`CoreAPI.createTeam(options)`

`options`:
* `team` - (required) the team object to create/insert.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ team: { /* ... */ } }`

### updateTeam

Update a team using a teamSlug and a team object.

`CoreAPI.updateTeam(options)`

`options`:
* `teamSlug` - (required) the slug of the team to be updated.
* `team` - (required) the team object to send to the server.
* `include` - API include parameters (see Kinetic CE reference documentation).


### deleteTeam

Deletes the team specified by the `teamSlug` option.

`CoreAPI.deleteTeam(options)`

`options`:
* `teamSlug` - (required) the slug of the team to be deleted.

Resolves: nothing.

## Space

### fetchSpace

Fetches the current space.

`CoreAPI.fetchSpace(options)`

`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).

## Kapp

### fetchKapps

Fetches all Kapps for the current space.

`CoreAPI.fetchKapps(options)`
 
`options`:
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ kapps: [{ /* ... */ }] }`

### fetchKapp

Fetches a Kapp from the current using the `kappSlug` option.

`CoreAPI.fetchKapp(options)`

`options`:
* `kappSlug` - the slug of the Kapp to fetch. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).

Resolves: `{ kapp: { /* ... */ } }`

## Forms

### fetchForms

Fetches all forms for the current space and Kapp. The Kapp can be overridden using the `kappSlug` option.

`CoreAPI.fetchForms(options)`
 
`options`:
* `kappSlug` - the slug of the Kapp in which to fetch forms. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ forms: [{ /* ... */ }] }`

### fetchForm

Fetches the form specified by the `formSlug` option in the current space and Kapp.
The Kapp can be overridden using the `kappSlug` option.

`CoreAPI.fetchForms(options)`
 
`options`:
* `formSlug` - (required) the slug of the form to fetch.
* `kappSlug` - the slug of the Kapp in which to fetch forms. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ form: { /* ... */ } }`

## Categories

### fetchCategories

Fetches all categories for the current space and Kapp. The Kapp can be overridden using the `kappSlug` option.

`CoreAPI.fetchCategories(options)`
 
`options`:
* `kappSlug` - the slug of the Kapp in which to fetch categories. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ categories: [{ /* ... */ }] }`

### fetchCategory

Fetches the category specified by the `categorySlug` option in the current space and Kapp.
The Kapp can be overridden using the `kappSlug` option.

`CoreAPI.fetchCategory(options)`
 
`options`:
* `categorySlug` - (required) the slug of the category to fetch.
* `kappSlug` - the slug of the Kapp in which to fetch forms. Defaults to the bundle kapp if not specified.
* `include` - API include parameters (see Kinetic CE reference documentation).
 
Resolves: `{ category: { /* ... */ } }`

## Submissions

### SubmissionSearch

Example usage:

```
// Create a new search object.
const search = new CoreAPI.SubmissionSearch()
  .eq('values[Owner]', 'IT')
  .eq('values[Priority]', 'High')
  .or()
    .eq('values[Status]', 'Open')
    .eq('values[Status]', 'In Progress')
    .end()
  .coreState('Draft')
  .includes(['details', 'values'])
  .build();

CoreAPI.searchSubmissions({ search }).then(/* ... */);
```

The above example is the equivalent of _search for all Draft submissions owned by IT, with a Priority of High, in a status of 'Open' or 'In Progress', and include the submission details and values._

Note that the first two `eq` calls in the example were implicitly `and()` in context. You can alter the context by grouping `eq()` and `in()` statements inside of `or()` and `and()` contexts. To end the context you use the `end()` function.

#### Equality Functions

* `eq(element, value)` - add an equality criteria. The element is in the format of `'values[Value Name]'`.
  
  Example: `search.eq('values[Status]', 'Open')`
* `in(element, values)` - add a list of equalities on a given element. The element is in the format of `'values[Value Name]'` and the values are an array, such as `['Value1', 'Value2']`.
  
  Example: `search.in('values[Status]', ['Open', 'In Progress'])`

#### Context Functions

All context functions group the equality functions between it and the next `end()`. For each context function there must be one `end()` function to close the group.

* `or()` - starts a group of "or" equality statements.

  Example: `search.or().eq('values[Status]', 'Open').eq('values[Status]', 'In Progress').end()`
  
  Results in: _Status=Open OR Status=In Progress_

* `and()` - starts a group of "and" equality statements.

  Example: `searcher.and().eq('values[Owner]', 'IT').eq('values[Priority]', 'High').end()`
  
  Results in: _Owner=IT AND Priority=High_
  
  **Note**: The example above is redundant as the implicit context is an `and` context. This is useful for grouping `and` and `or`.
  
* `end()` - concludes the most recently started context.

  **Note**: Failure to "close" an `and` or `or` context with `end()` will result in an error beign thrown.
  
#### Sorting Functions

Sorting functions cannot be nested inside of contexts such as `or()` and `and()`, they can only be issued on the outermost, implicit context. If used multiple times the last call is what is used.

* `sortBy(timeline)` - sort by a valid timeline: `closedAt`, `createdAt`, `submittedAt`, `updatedAt`
* `sortDirection(direction)` - set sort direction to a valid direction: `ASC` or `DESC`.

#### Metadata Functions

Metadata functions cannot be nested inside of contexts such as `or()` and `and()`, they can only be issued on the outermost, implicit context. If used multiple times the last call is what is used.

* `type(type)` - filter submissions by _form type_. Valid form types are defined in the Kapp.. Valid form types are defined in the Kapp. This can only be used if the `searchSubmissions()` call is provided a `kappSlug` option.
* `coreState(state)` - filter submissions by a valid core state: `'Draft'`, `'Submitted'`, `'Closed'`. If you set a core state other than `'Draft'` you **must** also set a `startDate()` and `endDate()`.
* `limit(num)` - limit the number of submissions returned. The default limit is 25, as determined by the Kinetic CE server. The maximum, also determined by the server, is 1000.
* `pageToken(toke)` - when `limit()` is used the resulting request will contain a `nextPageToken` key. Provide that value to the `pageToken()` function to get additional results.
* `include(key)` - include additional data in the return, e.g. `'form'` to get the form object that this submission is based on. This may be called multiple times to accumulate many includes.
* `includes(keys)` - include addition data in the return. This variant takes an array instead: `search.includes(['form', 'form.attributes'])`

#### Date Functions

The date functions cannot be nested inside of contexts such as `or()` and `and()`. The date functions will limit the results based on the currently sorted timeline. This can be changed with the `sortBy()` function. The default timeline is `'createdAt'`. The `date` must be a valid JavaScript `Date` object. The order in which you call these functions does not matter.

* `startDate(date)` - set the start date on the current timeline. The start date must be before the `endDate()`.
* `endDate(date)` - set the end date on the current timeline. The end date must be before the `startDate()`.

#### Execution Functions

* `build()` - takes all of the search criteria and metadata and builders the search request params.
* `raw()` - provides access to the raw query data, for troubleshooting purposes.

### searchSubmissions

Executes the results of a built `CoreAPI.SubmissionSearch` generator. See the example at the top of the [SubmissionSearch](#submissionsearch) documentation.

`CoreAPI.searchSubmissions(options)`

`options`:
* `form` - the slug of the form to limit the search to.
* `kapp` - the slug of the Kapp to limit the search to. If not provided this defaults to the bundle's current Kapp.
* `search` - the results of `SubmissionAPI.SubmissionSearch#build`. The search criteria and metadata.

Resolves:
```
{
  submissions: [{ /* ... */ }],
  messages: [], // Messages denoting any warnings or errors which occurred during searching.
  nextPageToken: '',
}
```

### fetchSubmission

Fetches a specific submission by ID.

`CoreAPI.fetchSubmission(options)`

`options`:
* `id` - (required) the ID of the submission to fetch.
* `include` - API include parameters (see Kinetic CE reference documentation).

### createSubmission

Create a submission based on a specific form.

`CoreAPI.createSubmission(options)`

`options`:
* `kappSlug` - the slug of the Kapp the form belongs to. If not specified this will default to the current bundle's Kapp.
* `formSlug` - (required) the slug of the form this submission is based upon.
* `values` - (required) the values to submit.

  Example: ```const values = { 'Field A': 'Value A', 'Field B': 'Value B' }```
* `completed` - true/false flag whether submission as complete or not. Default is true.
* `include` - API include parameters (see Kinetic CE reference documentation).

### deleteSubmission

Delete a submission given a specific ID.

`CoreAPI.deleteSubmission(options)`

`options`:
* `id` - (required) the ID of the submission to fetch.
* `include` - API include parameters (see Kinetic CE reference documentation).

## Bridged Resources

### fetchBridgedResource

Fetches data from a bridged resource.

`CoreAPI.fetchBridgedResource(options)`

`options`:
* `kappSlug` - the slug of the Kapp the form on which the resource is defined. If not specified this will default to the current bundle's Kapp.
* `formSlug` - (required) the slug of the form on which the resource is defined.
* `bridgedResourceName` - (required) the name of the bridged resource.
* `limit` - the maximum number of records to retrieve.
* `offset` - the offset of the first record to retrieve.
* `values` - a map of values for parameters. Example: `{ 'Last Name': 'Doe' }`
* `attributes` - an array of attributes (fields) to return. Example: `[ 'First Name', 'Last Name']`

When a single record is returned it resolves:

`{ record: { 'Field A': 'Value A'} }`

When multiple records are returned it resolves:

```
{
  records: [{ 'Field A', 'Value A' }, { /* ... */ }],
  metadata: { count: 2, nextPageToken: '...' }
}
```

### countBridgedResource

Fetches a count of the number of records that match a bridge query.

`CoreAPI.countBridgedResource(options)`

`options`:
* `kappSlug` - the slug of the Kapp the form on which the resource is defined. If not specified this will default to the current bundle's Kapp.
* `formSlug` - (required) the slug of the form on which the resource is defined.
* `bridgedResourceName` - (required) the name of the bridged resource.
* `limit` - the maximum number of records to retrieve.
* `offset` - the offset of the first record to retrieve.
* `values` - a map of values for parameters. Example: `{ 'Last Name': 'Doe' }`
* `attributes` - an array of attributes (fields) to return. Example: `[ 'First Name', 'Last Name']`

Resolves:

`{ count: 2 }`
