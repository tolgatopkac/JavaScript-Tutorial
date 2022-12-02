# LocalStorage, sessionStorage

Web storage objects `localStorage` and `sessionStorage` allow to save **key/value** pairs in browser.

- **sessionStorage** : data survives a page refresh
- **localStorage** : data survives even a full browser restart

Both storage objects provide the same methods and properties

- `setItem(key, value)` -- store key/value pair.
- `getItem( key )` -- get the value by key.
- `removeItem( key )` -- remove the key with its value
- `clear( )` -- delete everything.
- `key( index ) ` -- get the key on a given position
- `length` -- the number of stored items

## localStorage Demo

The main features of `localStorage` are

- Shared between all tabs and windows from the same origin.
- The data does not expire. It remains after the browser restart and even OS reboot.
  ![enter image description here](https://i.ibb.co/gSKSCcW/carbon-12.png)

Not ❗❗ : The `localStorage` is shared between all windows with the same origin, so if we set the data in one window, the change becomes visible in another one.

## Object-like access

We can also use a plain object way of getting/setting keys like this:
![enter image description here](https://i.ibb.co/2Ky2ZsN/carbon-13.png)

## Looping over keys

- How to get all saved values or keys ?
  Storage objects are not iterable.

One way is to loop over them as over an array :
![enter image description here](https://i.ibb.co/98rF5kL/carbon-14.png)

Another way is to use `for key in localStorage` loop just as we do with regular objects.

- We need either to filter fields from the prototype with `hasOwnProperty` check

![enter image description here](https://i.ibb.co/Y4SgbWK/carbon-15.png)

... OR just get "own" keys with `Object.keys` and then loop over them if needed :
![enter image description here](https://i.ibb.co/zN6m6t0/carbon-16.png)

## Strings only

❗❗ Key and value must be strings.
If they were any other type, like a number or an object, they would get converted to a string automatically.
![enter image description here](https://i.ibb.co/M2ZR4k9/carbon-17.png)

We can use `JSON` to store objects though:
![enter image description here](https://i.ibb.co/311VRXK/carbon-19.png)

Also it is possible to stringify the whole storage object, e.g for debugging purposes :
![enter image description here](https://i.ibb.co/sQJ6sj6/carbon-20.png)

OUTPUT :
![enter image description here](https://i.ibb.co/0ttnkqR/21.png)

## sessionStorage

The `sessionStorage` object is used much less often than `localStorage`

Properties and methods are the same, but it's much more limited:

- ❗❗The `sessionStorage` exists only within the current browser tab.
- Another tab with the same page will have a different storage.
- But it is shared between iframes in the same tab (assuming the come from the same origin).
- The data survives page refresh, but not closing/opening the tab.
  ![enter image description here](https://i.ibb.co/B4wnxYH/carbon-22.png)

But if you open the same page in another tab, and try again there, the code above return `null` meaning "nothing found".

That's exactly because `sessionStorege`is bound not only to the origin, but also the browser tab. For that reason `sessionStorage` is used sparingly.

## Storage event

When the data gets updated in `localStorage` or `sessionStorage` storage event triggers, with properties:

- `key` -- the key that was changed ( `null` if `.clear()` is called).
- `oldValue` -- the old value ( `null` if the key is newly added )
- `newValue` -- the new value ( `null` if the key is removed)
- `url ` -- the url of the document where the update happened.
- `storageArea` -- either `localStorage`or `sessionStorage` object where the update happened.

❗❗❗ The important thing is: the event triggers on all `window`objects where the storage is accessible, except the one that caused it.

# Summary

Web storage objects `localStorage` and `sessionStorage` allow to store key/value pairs in the browser.

- Both `key` and `value` must be strings.
- The limit is 5mb+, depends on the browser.
- They do not expire.
- The data bound to the origin ( domain/port/protocol).

| `localStorage`                                           | `sessionStorage`                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------- | --- |
| Shared between all tabs and windows with the same origin | Visible within a browser tab, including iframes from the same origin. |
| Survives browser restart                                 | Survives page refresh (but not tab close)                             |
|                                                          |                                                                       |     |

### API

- `setItem(key, value) ` -- store key/value pair
- `getItem(key)` -- get the value by key.
- `removeItem(key)` -- remove the key with its value.
- `clear( )` -- delete everything.
- `key(index)` -- get the key number `index`
- `length` -- the number of stored items.
- Use `Object.keys` to get all keys.
- We access keys as object properties, in that case `storage`event is'nt triggered.

### Storage event

- Triggers on `setItem`, `removeItem`, `clear` calls.
- Contains all the data about the operation (`key/oldValue/newValue`), the document `url` and the storage object `storageArea`.
- Triggers on all `window` objects that have access to the storage except the one that generated it (within a tab for `sessionStorage`, globally for `localStorage`).
